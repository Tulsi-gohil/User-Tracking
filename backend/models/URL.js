const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
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
  cameraImage: String,  
  timestamp: { type: Date, default: Date.now }
}, { _id: false }); 

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  destinationUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'ragister', required: true },
  analytics: [analyticsSchema]  
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);