const cron = require('node-cron');
const CaseModel = require('../models/Case');

function startSlaScheduler(io) {
  const cronExpr = process.env.SLA_CHECK_CRON || "*/1 * * * *";
  cron.schedule(cronExpr, async () => {
    const now = new Date();
    const breached = await CaseModel.find({ status: { $in: ['open','assigned','in_progress'] }, slaDeadline: { $lt: now } });
    for (const c of breached) {
      c.status = 'escalated';
      c.history.push({ by: 'system', action: 'SLA breached - escalated', at: new Date() });
      await c.save();
      if (io) io.emit('case-escalated', c);
      console.log('Escalated case', c._id);
    }
  });
}

module.exports = startSlaScheduler;
