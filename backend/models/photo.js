const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Photo", photoSchema);