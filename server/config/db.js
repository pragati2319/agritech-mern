const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{family:4});
    console.log('MongoDB connected');
  } catch (e) {
    console.error('REASON:', e.reason && e.reason.servers ? [...e.reason.servers.values()].map(s => s.error && s.error.message):e.message);
    process.exit(1);
  }
};
