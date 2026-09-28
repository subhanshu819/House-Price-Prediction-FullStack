const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { getAdminDashboardData } = require('../controllers/adminController');

const router = express.Router();

// GET /api/admin/dashboard — admin role strictly enforced
router.get(
  '/dashboard',
  authenticateToken,
  authorizeRoles('admin'),
  getAdminDashboardData
);

module.exports = router;
