const router = require('express').Router();
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');
router.use(protect, authorize('admin'));

router.get('/stats', async (req, res, next) => {
  try {
    const [users, farms, crops, orders] = await Promise.all([User.countDocuments(), Farm.countDocuments(), Crop.countDocuments(), Order.countDocuments()]);
    res.json({ users, farms, crops, orders });
  } catch (e) { next(e); }
});
router.get('/users', async (req, res, next) => { try { res.json(await User.find()); } catch (e) { next(e); } });
router.put('/users/:id/role', async (req, res, next) => {
  try { res.json(await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })); } catch (e) { next(e); }
});
router.delete('/users/:id', async (req, res, next) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});
router.get('/orders', async (req, res, next) => {
  try { res.json(await Order.find().populate('user', 'name email').sort('-createdAt')); } catch (e) { next(e); }
});
router.put('/orders/:id', async (req, res, next) => {
  try { res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (e) { next(e); }
});
router.delete('/posts/:id', async (req, res, next) => {
  try { await Post.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});
module.exports = router;
