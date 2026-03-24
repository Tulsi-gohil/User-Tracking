const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const  dbcon =require("./libs/db")
 const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());  
app.use(express.json());
dbcon()
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
app.use("/api/auth", require("./routes/admin"));
app.get("/" ,( req,res) =>{
res.send("backend is running");
}
)

app.use('/proxy', createProxyMiddleware({
  target: 'https://flipkart.com',  
  changeOrigin: true,
  selfHandleResponse: false
}));
app.listen(5000, () => console.log("Server running on port 5000"));
const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const  dbcon =require("./libs/db")
 const { createProxyMiddleware } = require('http-proxy-middleware');
 
app.use(cors());
app.use(express.json());
app.use(useragent.express());  
app.use(express.json());
dbcon()
 
app.use("/api/auth", require("./routes/admin"));
app.get("/" ,( req,res) =>{
res.send("backend is running");
}
)

app.use('/proxy', createProxyMiddleware({
  target: 'https://flipkart.com',  
  changeOrigin: true,
  selfHandleResponse: false
}));
app.listen(5000, () => console.log("Server running on port 5000"));
