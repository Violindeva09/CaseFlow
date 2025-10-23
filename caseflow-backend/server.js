const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for demo purposes
let users = [];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;

  // Simple validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    fullName,
    email,
    password, // In production, hash the password
    role: 'citizen' // Default role
  };

  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
