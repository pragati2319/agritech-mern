const router = require('express').Router();
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');
router.use(protect);

// Rule-based soil health analysis from the farm's stored soil data
router.get('/:farmId', async (req, res, next) => {
  try {
    const f = await Farm.findOne({ _id: req.params.farmId, owner: req.user._id });
    if (!f) return res.status(404).json({ message: 'Farm not found' });
    const s = f.soil || {}; const tips = [];
    if (s.ph != null) { if (s.ph < 6) tips.push('Soil is acidic: add lime.'); else if (s.ph > 7.5) tips.push('Soil is alkaline: add sulfur or organic matter.'); }
    if (s.nitrogen != null && s.nitrogen < 280) tips.push('Low nitrogen: apply urea or compost.');
    if (s.phosphorus != null && s.phosphorus < 11) tips.push('Low phosphorus: apply DAP/SSP.');
    if (s.potassium != null && s.potassium < 110) tips.push('Low potassium: apply MOP.');
    if (s.moisture != null && s.moisture < 20) tips.push('Low moisture: irrigate soon.');
    res.json({ soil: s, status: tips.length ? 'needs attention' : 'healthy', recommendations: tips });
  } catch (e) { next(e); }
});
module.exports = router;
