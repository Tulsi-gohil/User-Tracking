const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const  dbcon =require("./libs/db")
const { createProxyMiddleware } = require('http-proxy-middleware');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());  
app.use(express.json());
dbcon();
app.use("/api/auth", require("./routes/admin"));
app.get("/" ,( req,res) =>{
res.send("backend is running");
})
let storedCookies = {
  request: null,  
  response: null  
};
 
app.use('/proxy', (req,res) =>{createProxyMiddleware({
  target: req.query.redirectUrl,  
  changeOrigin: true,
  selfHandleResponse: false
  ,
  onProxyReq: (proxyReq, req, res) => {
    
      const reqCookies = req.headers.cookie;

      console.log("👉 Request Cookies:");
      console.log(reqCookies);

      storedCookies.request = reqCookies;
    },
 
   onProxyRes: (proxyRes, req, res) => {
      const resCookies = proxyRes.headers['set-cookie'] ;

      console.log("👉 Response Cookies:");
      console.log(resCookies);

      if (resCookies) {
        storedCookies.response = resCookies;
      }
    },
  
})});    
 
const PORT = process.env.PORT || 5000;
 app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
