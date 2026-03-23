const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const jwt = require("jsonwebtoken");
const dbcon = require("./libs/db");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(useragent.express());

// DB Connection
dbcon();


// Routes
app.use("/api/auth", require("./routes/admin"));

// Test Route
app.get("/", (req, res) => {
  res.send("backend is running");
});

// Proxy
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://flipkart.com",
    changeOrigin: true,
  })
);

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));