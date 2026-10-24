const mongoose = require('mongoose');
module.exports = mongoose.model('Crop', new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sownOn: Date,
  expectedHarvest: Date,
  status: { type: String, enum: ['sown', 'growing', 'harvested'], default: 'sown' },
  activityLog: [{ note: String, date: { type: Date, default: Date.now } }],
  pestAlerts: [{ pest: String, severity: { type: String, enum: ['low', 'medium', 'high'] }, date: { type: Date, default: Date.now } }]
}, { timestamps: true }));
