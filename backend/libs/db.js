const mongoose = require("mongoose");
require("dotenv").config();

const dbcon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB is connected ✅");
  } catch (error) {
    console.error("MongoDB not connected ❌", error);
  }
};

module.exports = dbcon;