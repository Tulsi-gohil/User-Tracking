const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
  ip: String,
  latitude: String,
  longitude: String,
  ram: String,
  cpuCores: String,
  batteryLevel: String,
  isCharging: Boolean,
  browser: String,
  platform: String,
  screen: String,
  page: String,
  uniqueId: String,
   image: {
    type: String,
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', UserSchema);
