const mongoose = require('mongoose');
module.exports = mongoose.model('Order', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ resource: String, qty: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'], default: 'pending' }
}, { timestamps: true }));
