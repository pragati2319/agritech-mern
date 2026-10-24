const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/error');
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

router.post('/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })], validate,
  async (req, res, next) => {
    try {
      if (await User.findOne({ email: req.body.email })) return res.status(400).json({ message: 'Email already used' });
      // role is always farmer on signup; promote admins manually in the DB
      const u = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password, language: req.body.language });
      res.status(201).json({ token: sign(u._id), user: { id: u._id, name: u.name, email: u.email, role: u.role } });
    } catch (e) { next(e); }
  });

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, async (req, res, next) => {
  try {
    const u = await User.findOne({ email: req.body.email }).select('+password');
    if (!u || !(await u.matchPassword(req.body.password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(u._id), user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json(req.user));
module.exports = router;
