const router = require('express').Router();
const { body } = require('express-validator');
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/error');
router.use(protect);

router.get('/', async (req, res, next) => {
  try { res.json(await Farm.find({ owner: req.user._id })); } catch (e) { next(e); }
});
router.post('/', [body('name').notEmpty()], validate, async (req, res, next) => {
  try { res.status(201).json(await Farm.create({ ...req.body, owner: req.user._id })); } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const f = await Farm.findOne({ _id: req.params.id, owner: req.user._id });
    f ? res.json(f) : res.status(404).json({ message: 'Farm not found' });
  } catch (e) { next(e); }
});
router.put('/:id', async (req, res, next) => {
  try {
    const f = await Farm.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    f ? res.json(f) : res.status(404).json({ message: 'Farm not found' });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const f = await Farm.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    f ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Farm not found' });
  } catch (e) { next(e); }
});
module.exports = router;
