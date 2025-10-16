const Case = require('../models/Case');
const User = require('../models/User');
const assignmentService = require('../services/assignmentService');

exports.createCase = async (req, res) => {
  try {
    const { title, description, priority, topic, tier } = req.body;
    const now = new Date();
    // SLA deadline logic
    let slaHours = 72;
    if (priority === 'critical') slaHours = 1;
    else if (priority === 'high') slaHours = 4;
    else if (priority === 'medium') slaHours = 24;
    const slaDeadline = new Date(now.getTime() + slaHours * 3600 * 1000);

    const nc = await Case.create({
      title, description, priority, topic, tier,
      slaDeadline, createdAtClient: now, customerId: req.user.id
    });
    // Auto-assign agent
    const assigned = await assignmentService.assignCase(nc);
    res.json({ ok: true, case: assigned || nc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({}).populate('assignedTo customerId').sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const c = await Case.findByIdAndUpdate(id, body, { new: true });
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    const caseDoc = await Case.findById(id);
    if (!caseDoc) return res.status(404).json({ error: 'Case not found' });

    // Handle workload: decrement old agent's workload if reassigned
    if (caseDoc.assignedTo) {
      const oldAgent = await User.findById(caseDoc.assignedTo);
      if (oldAgent) {
        oldAgent.workload = Math.max(0, (oldAgent.workload || 0) - 1);
        await oldAgent.save();
      }
    }

    // Increment new agent's workload
    const newAgent = await User.findById(agentId);
    if (newAgent) {
      newAgent.workload = (newAgent.workload || 0) + 1;
      await newAgent.save();
    }

    const c = await Case.findByIdAndUpdate(id, {
      assignedTo: agentId,
      status: 'assigned',
      assignedAt: new Date(),
      $push: { history: { by: req.user.username, action: 'assigned', at: new Date() } }
    }, { new: true }).populate('assignedTo');
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.escalateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Case.findByIdAndUpdate(id, {
      status: 'escalated',
      $push: { history: { by: req.user.username, action: 'escalated', at: new Date() } }
    }, { new: true });
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resolveCase = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Case.findByIdAndUpdate(id, {
      status: 'resolved',
      $push: { history: { by: req.user.username, action: 'resolved', at: new Date() } }
    }, { new: true });
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
