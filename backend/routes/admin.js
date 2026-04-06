const express = require("express");
const router = express.Router();
const Visitor = require("../models/user");
const Url = require("../models/URL");
const Cookie = require("../models/photo");
const User = require("../models/ragister");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const useragent = require("express-useragent");

const { nanoid } = require("nanoid");
const auth = require("../utils/auth");

router.use(useragent.express());

const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const { HttpCookieAgent, HttpsCookieAgent } = require('http-cookie-agent/http');

const jar = new CookieJar();
const client = wrapper(
  axios.create({
    jar,
    withCredentials: true,
    maxRedirects: 0,           
     headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Cache-Control": "max-age=0",
    },
  })
);
router.post("/generate", auth, async (req, res) => {
  try {
    const { destinationUrl } = req.body;
    const shortId = nanoid(10);

    const url = await Url.create({
      shortId: shortId,
      destinationUrl: destinationUrl,
      user: req.user,
      clicks: 0,
      analytics: []
    });

    res.json({ success: true, id: shortId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/t/:shortId", auth, async (req, res) => {
  try {
    const { shortId } = req.params;
    const visitorData = req.body;

    /**
     * Step 1: Update clicks + analytics
     */
    const urlData = await Url.findOneAndUpdate(
      { shortId },
      {
        $inc: { clicks: 1 },
        $push: { analytics: visitorData }
      },
      { returnDocument: 'after'}
    );

    if (!urlData) {
      return res.status(404).json({ message: "Link not found" });
    }

    try {
      const parsedUrl = new URL(urlData.destinationUrl);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

      /**
       * Step 2: Visit homepage (simulate real user)
       */
      await client.get(baseUrl, {
        headers: { Referer: "https://www.google.com" }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      /**
       * Step 3: Visit destination
       */
      const response = await client.get("https://scaninfoga.com", {
        headers: { Referer: baseUrl }
      });

      const redirectUrl = response.headers["location"];
      const status = response.status;

      /**
       * Step 4: Extract cookies
       */
      const cookies = await jar.getCookies(urlData.destinationUrl);

      const cookieList = cookies.map(c => ({
        key: c.key,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: c.expires,
        httpOnly: c.httpOnly,
        secure: c.secure
      }));

      console.log("📍 Status:", status);
      console.log("📍 Redirect:", redirectUrl);
      console.log("🍪 Cookies:", cookieList);

      /**
       * Step 5: Save cookies properly
       */
      if (cookieList.length > 0) {
        await Url.findOneAndUpdate(
          { shortId },
          {
            $push: {
              cookies: {
                cookies: cookieList,
                createdAt: new Date()
              }
            }
          }
        );
      }

      /**
       * Step 6: Send response
       */
      return res.json({
        success: true,
        redirectUrl: redirectUrl || urlData.destinationUrl,
        cookies: cookieList
      });

    } catch (err) {
      console.log("Cookie fetch failed:", err.message);
    }

    return res.json({
      success: true,
      redirectUrl: urlData.destinationUrl
    });

  } catch (error) {
    console.error("Tracking error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Tracking failed" });
    }
  }
});


router.get("/analytics/:shortId", auth, async (req, res) => {
  try {
    const urlData = await Url.find({ user: req.user });
    if (!urlData || urlData.length === 0) return res.status(404).json({ message: "No data found" });
   
    res.json({
     
          
     
      logs: urlData.map((url) => ({
        shortId: url.shortId,
        destinationUrl: url.destinationUrl,
        clicks: url.clicks,
        user: url.user,
        analytics: url.analytics,
        cookies: url.cookies
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});


router.post("/exit/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const { exitTime } = req.body;

    // FIXED: Removed undefined 'flwssn' and redundant 'res.sendStatus'
    await Url.findOneAndUpdate(
      { shortId },
      {
        $push: { analytics: { event: "EXIT", time: exitTime || new Date() } }
      }
    );

    res.json({ success: true });
  } catch (error) {
    if (!res.headersSent) res.status(500).end();
  }
});

router.post("/ragister", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ timestamp: -1 });
    res.json(users.map(user => ({
      username: user.name,
      email: user.email,
      timestamp: user.timestamp
    })));
  } catch (e) {
    res.status(500).json({ message: "Error in fetching users" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const uniqueIPs = await Visitor.distinct("ip");
    const pageViews = await Visitor.aggregate([
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: { totalVisits, uniqueVisitors: uniqueIPs.length, pageViews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

module.exports = router;
