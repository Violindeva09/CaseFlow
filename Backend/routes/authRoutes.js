const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route definitions
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/agents', authController.getAgents);

module.exports = router;
