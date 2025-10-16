const User = require('../models/User');
const CaseModel = require('../models/Case');

async function candidateScore(agent, caseDoc) {
  let score = 0;
  if (agent.skills && agent.skills.includes(caseDoc.topic)) score += 50;
  if (agent.capacity && agent.workload < agent.capacity) score += 30;
  if (caseDoc.tier === 'premium') score += 20;
  score += Math.max(0, (agent.capacity - agent.workload)) * 2;
  return score;
}

exports.assignCase = async function (caseDoc) {
  const agents = await User.find({ role: 'agent' });
  if (!agents || agents.length === 0) return null;

  let best = null, bestScore = -1;
  for (const a of agents) {
    const s = await candidateScore(a, caseDoc);
    if (s > bestScore) { bestScore = s; best = a; }
  }
  if (best) {
    const assigned = await CaseModel.findByIdAndUpdate(caseDoc._id, {
      assignedTo: best._id,
      status: 'assigned',
      assignedAt: new Date(),
      $push: { history: { by: 'system', action: `auto-assigned to ${best.username}`, at: new Date() } }
    }, { new: true });
    best.workload = (best.workload || 0) + 1;
    await best.save();
    return assigned;
  }
  return null;
};
