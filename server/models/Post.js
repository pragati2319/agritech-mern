const mongoose = require('mongoose');
module.exports = mongoose.model('Post', new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: String,
  replies: [{ author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true }));
