const router = require('express').Router();
const { body } = require('express-validator');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/error');
router.use(protect);

router.get('/', async (req, res, next) => {
  try { res.json(await Post.find().populate('author', 'name role').sort('-createdAt')); } catch (e) { next(e); }
});
router.post('/', [body('title').notEmpty()], validate, async (req, res, next) => {
  try { res.status(201).json(await Post.create({ ...req.body, author: req.user._id })); } catch (e) { next(e); }
});
router.post('/:id/reply', [body('text').notEmpty()], validate, async (req, res, next) => {
  try {
    const p = await Post.findByIdAndUpdate(req.params.id, { $push: { replies: { author: req.user._id, text: req.body.text } } }, { new: true });
    p ? res.json(p) : res.status(404).json({ message: 'Post not found' });
  } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const p = await Post.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Post not found' });
    if (String(p.author) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await p.deleteOne(); res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});
module.exports = router;
