const router = require('express').Router();
const axios = require('axios');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const WeatherData = require('../models/WeatherData');
const { protect } = require('../middleware/auth');
router.use(protect);

// Pest alerts (declared before /:farmId so "pest" isn't treated as an id)
router.post('/pest/:cropId', async (req, res, next) => {
  try {
    const c = await Crop.findOneAndUpdate({ _id: req.params.cropId, owner: req.user._id }, { $push: { pestAlerts: req.body } }, { new: true });
    c ? res.json(c.pestAlerts) : res.status(404).json({ message: 'Crop not found' });
  } catch (e) { next(e); }
});
router.get('/:farmId/history', async (req, res, next) => {
  try { res.json(await WeatherData.find({ farm: req.params.farmId }).sort('-fetchedAt').limit(30)); } catch (e) { next(e); }
});
router.get('/:farmId', async (req, res, next) => {
  try {
    const f = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
    if (!f) return res.status(404).json({ message: 'Farm not found' });
    const { lat, lon } = f.location || {};
    if (lat == null || lon == null) return res.status(400).json({ message: 'Set farm lat/lon first' });
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat, lon, units: 'metric', appid: process.env.OPENWEATHER_KEY }
    });
    const w = await WeatherData.create({ farm: f._id, temp: data.main.temp, humidity: data.main.humidity, description: data.weather[0].description, wind: data.wind.speed });
    const alerts = [];
    if (w.humidity > 80 && w.temp > 20) alerts.push('High humidity + warmth: fungal disease risk.');
    if (w.temp > 38) alerts.push('Heat stress risk: irrigate in evenings.');
    if (w.wind > 10) alerts.push('Strong wind: delay spraying.');
    res.json({ weather: w, alerts });
  } catch (e) { next(e); }
});
module.exports = router;
