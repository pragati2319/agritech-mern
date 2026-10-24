const router = require('express').Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
router.use(protect);

router.get('/', async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort('-createdAt')); } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const items = req.body.items || [];
    if (!items.length) return res.status(400).json({ message: 'No items' });
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    res.status(201).json(await Order.create({ user: req.user._id, items, total }));
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const o = await Order.findOne({ _id: req.params.id, user: req.user._id });
    o ? res.json(o) : res.status(404).json({ message: 'Order not found' });
  } catch (e) { next(e); }
});
module.exports = router;
