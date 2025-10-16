const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: String,
  passwordHash: String,
  role: { type: String, enum: ['admin','agent','citizen','supervisor'], required: true },
  skills: [String],
  capacity: { type: Number, default: 5 },
  workload: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
