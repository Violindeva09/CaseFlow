const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/caseController');
const { authenticate, authorizeRoles } = require('../utils/authMiddleware');

router.get('/', authenticate, ctrl.getCases);
router.post('/', authenticate, ctrl.createCase);
router.patch('/:id', authenticate, ctrl.updateCase);
router.put('/:id/assign', authenticate, authorizeRoles('admin', 'supervisor'), ctrl.assignCase);
router.put('/:id/escalate', authenticate, authorizeRoles('supervisor', 'citizen'), ctrl.escalateCase);
router.put('/:id/resolve', authenticate, authorizeRoles('agent'), ctrl.resolveCase);

module.exports = router;
