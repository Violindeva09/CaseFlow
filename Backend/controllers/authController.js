const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

exports.register = async (req, res) => {
  try {
    // DEBUG: Log received payload
    console.log('Register payload:', req.body);

    // Validation: Check required fields
    const { username, name, password, role, skills } = req.body;
    if (!username || !name || !password || !role) {
      return res.status(400).json({
        error: 'Missing required field(s). username, name, password, and role are required.'
      });
    }
    if (role === 'admin') {
      return res.status(403).json({ error: 'Cannot register as admin' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken. Choose a different one.' });
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      name,
      passwordHash: hash,
      role,
      skills: skills || []
    });

    // Success response
    res.json({
      ok: true,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    // Generic error handler (for JSON parsing or DB issues)
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};
