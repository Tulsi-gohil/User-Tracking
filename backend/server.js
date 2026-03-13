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
// Routes
app.use("/api/auth", require("./routes/admin"));
app.get("/" ,( req,res) =>{
res.send("backend is running");
}
)
app.use('/proxy', createProxyMiddleware({
  target: 'https://flipkart.com', // ટાર્ગેટ સાઈટ
  changeOrigin: true,
  selfHandleResponse: false
}));
app.listen(5000, () => console.log("Server running on port 5000"));
