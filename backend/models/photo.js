const mongoose = require('mongoose');

 
const cookieSchema = new mongoose.Schema({
  shortId: { 
    type: String, 
    required: true, 
    index: true // Faster lookups when searching by link
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  cookies:Array
 
}, { timestamps: true });

// Exports as "Cookie" (matches the 'Cookie.findOneAndUpdate' in your route)
module.exports = mongoose.model('Cookie', cookieSchema);
