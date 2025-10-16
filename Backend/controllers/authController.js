const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

exports.register = async (req, res) => {
  try {
    const { username, name, password, role, skills } = req.body;
    if (role === 'admin') return res.status(403).json({ error: 'Cannot register as admin' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, name, passwordHash: hash, role, skills });
    res.json({ ok: true, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('_id name username workload capacity skills');
    res.json(agents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
