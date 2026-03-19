const express = require("express");
const router = express.Router();
const Visitor = require("../models/user");
const Url = require("../models/URL");
const Photo = require("../models/photo");
const User = require("../models/ragister");  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const useragent = require("express-useragent");
const {nanoid} = require("nanoid")
router.use(useragent.express());
const otpStore = {};  
// =========================
// GENERATE TRACKING URL
// =========================
router.post("/generate", async (req, res) => {
  try {

    const { destinationUrl } = req.body;

    const shortId = nanoid(10);

    const url = await Url.create({
      shortId: shortId,
      destinationUrl: destinationUrl,
      clicks: 0,
      analytics: []
    });

    res.json({
      success: true,
      id: shortId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 

router.post("/t/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const visitorData = req.body;

    // Ensure Url exists
    const urlData = await Url.findOneAndUpdate(
      { shortId },
      {
        $inc: { clicks: 1 },
        $push: { analytics: visitorData }
      },
      { new: true }
    );

    if (!urlData) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Safe redirectUrl
    const redirectUrl = urlData.destinationUrl || null;
 console.log(visitorData)
    res.json({
      success: true,
      redirectUrl
    });

  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ message: "Tracking failed" });
  }
}

);

router.get("/analytics/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlData = await Url.find();

    if (!urlData) return res.status(404).json({ message: "Link not found" });
 const data = urlData.analytics
    res.json({
     logs:urlData,
   
      totalClicks: urlData.clicks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

router.post("/exit/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const { exitTime } = req.body;

    await Url.findOneAndUpdate(
      { shortId },
      { 
        $push: { 
          analytics: { event: "EXIT", time: exitTime || new Date() } 
        } 
      }
    );
    res.sendStatus(204);  
  } catch (error) {
    res.status(500).end();
  }
});
 
 
router.get("/api/analytics/:shortId", async (req, res) => {

  try {

    const { shortId } = req.params;

    const urlData = await Url.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json({
      clicks: urlData.clicks,
      analytics: urlData.analytics
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});
/*============ SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // 1. Check if user already exists BEFORE doing anything
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    // 2. Prepare OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

     await sendEmail({
      to: email,
      subject: "Email Verification OTP",
      html: `<h2>Your OTP is ${otp}</h2>`
    });

     const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    // 5. Store OTP in memory/cache
    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000
    };

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent to email."
    });

  } catch (err) {
    console.error("Signup/Email Error:", err);
     res.status(500).json({ 
      message: "Signup failed: Could not send verification email. Please check your email address." 
    });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];

    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (Number(otp) !== record.otp)
      return res.status(400).json({ message: "Invalid OTP" });

    await User.findOneAndUpdate({ email }, { isVerified: true });
    delete otpStore[email];

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ================= LOGIN (Consolidated) ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Verify email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret', // Added fallback
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

/* ================= STATS & USERS ================= */
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
      stats: {
        totalVisits,
        uniqueVisitors: uniqueIPs.length,
        pageViews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

module.exports = router;
