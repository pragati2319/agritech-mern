const mongoose = require('mongoose');
module.exports = mongoose.model('WeatherData', new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', index: true },
  temp: Number, humidity: Number, description: String, wind: Number,
  fetchedAt: { type: Date, default: Date.now }
}));
