const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['low','medium','high','critical'], default: 'low' },
  topic: String,
  tier: { type: String, enum: ['standard','premium'], default: 'standard' },
  status: { type: String, enum: ['open','assigned','in_progress','escalated','resolved'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedAt: Date,
  createdAtClient: { type: Date, default: Date.now },
  slaDeadline: Date,
  history: [{ by: String, action: String, at: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Case', CaseSchema);
