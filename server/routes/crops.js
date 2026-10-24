const router = require('express').Router();
const { body } = require('express-validator');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/error');
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const q = { owner: req.user._id };
    if (req.query.farm) q.farm = req.query.farm;
    res.json(await Crop.find(q).populate('farm', 'name'));
  } catch (e) { next(e); }
});
router.post('/', [body('name').notEmpty(), body('farm').isMongoId()], validate, async (req, res, next) => {
  try {
    if (!(await Farm.exists({ _id: req.body.farm, owner: req.user._id }))) return res.status(404).json({ message: 'Farm not found' });
    res.status(201).json(await Crop.create({ ...req.body, owner: req.user._id }));
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const c = await Crop.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
    c ? res.json(c) : res.status(404).json({ message: 'Crop not found' });
  } catch (e) { next(e); }
});
router.post('/:id/log', [body('note').notEmpty()], validate, async (req, res, next) => {
  try {
    const c = await Crop.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { $push: { activityLog: { note: req.body.note } } }, { new: true });
    c ? res.json(c) : res.status(404).json({ message: 'Crop not found' });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const c = await Crop.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    c ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Crop not found' });
  } catch (e) { next(e); }
});
module.exports = router;
