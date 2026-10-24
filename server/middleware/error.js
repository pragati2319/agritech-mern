const { validationResult } = require('express-validator');
exports.validate = (req, res, next) => {
  const e = validationResult(req);
  return e.isEmpty() ? next() : res.status(400).json({ errors: e.array() });
};
exports.notFound = (req, res) => res.status(404).json({ message: 'Route not found' });
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};
