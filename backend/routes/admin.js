const express = require('express');
const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserDetails,
  updateChallenge,
  deleteChallenge,
  createAchievement,
  getAllAchievements,
  updateAchievement,
  getSystemStats,
  cleanupExpiredSessions,
  getSystemLogs
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId/status', updateUserStatus);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

// Challenge Management Routes
router.put('/challenges/:id', updateChallenge);
router.delete('/challenges/:id', deleteChallenge);

// Achievement Management Routes
router.get('/achievements', getAllAchievements);
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);

// System Analytics and Statistics
router.get('/stats', getSystemStats);

// System Maintenance Routes
router.post('/cleanup/sessions', cleanupExpiredSessions);
router.get('/logs', getSystemLogs);

module.exports = router;