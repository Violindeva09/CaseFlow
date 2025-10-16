const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../utils/authMiddleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/agents', authenticate, ctrl.getAgents);

module.exports = router;
