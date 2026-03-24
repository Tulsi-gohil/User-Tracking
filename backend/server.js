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
dbcon();
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

 const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
