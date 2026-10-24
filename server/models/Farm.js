const mongoose = require('mongoose');
module.exports = mongoose.model('Farm', new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { city: String, state: String, lat: Number, lon: Number },
  sizeAcres: Number,
  soil: { soilType: String, ph: Number, nitrogen: Number, phosphorus: Number, potassium: Number, moisture: Number }
}, { timestamps: true }));
