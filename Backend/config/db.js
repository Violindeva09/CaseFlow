const mongoose = require('mongoose');

async function connectDB(uri, options = { retries: 2, retryDelayMs: 1000 }) {
  let attempts = 0;
  while (attempts <= options.retries) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      attempts += 1;
      console.error(`MongoDB connection attempt ${attempts} failed:`, err.message || err);
      if (attempts > options.retries) throw err;
      await new Promise(r => setTimeout(r, options.retryDelayMs));
    }
  }
}

module.exports = connectDB;