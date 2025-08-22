const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/main');

router.get('/', ctrl.home);
router.get('/intake', ctrl.intake);
router.get('/dashboard', ctrl.dashboard);
router.get('/reports', ctrl.reports);

module.exports = router;
