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
const {
  validateUserRoleUpdate,
  validateUserStatusUpdate,
  validateChallengeUpdate,
  validateAchievementCreation,
  validateMongoId,
  validatePaginationParams,
  validateFilterParams
} = require('../middleware/validation');
const { createRoleBasedLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Apply role-based rate limiting (admins get higher limits)
const adminLimiter = createRoleBasedLimiter(50, 200, 500); // student, instructor, admin limits
router.use(adminLimiter);

// User Management Routes
router.get('/users', validatePaginationParams, validateFilterParams, getAllUsers);
router.get('/users/:userId', validateMongoId('userId'), getUserDetails);
router.put('/users/:userId/status', validateMongoId('userId'), validateUserStatusUpdate, updateUserStatus);
router.put('/users/:userId/role', validateMongoId('userId'), validateUserRoleUpdate, updateUserRole);
router.delete('/users/:userId', validateMongoId('userId'), deleteUser);

// Challenge Management Routes
router.put('/challenges/:id', validateMongoId('id'), validateChallengeUpdate, updateChallenge);
router.delete('/challenges/:id', validateMongoId('id'), deleteChallenge);

// Achievement Management Routes
router.get('/achievements', getAllAchievements);
router.post('/achievements', validateAchievementCreation, createAchievement);
router.put('/achievements/:id', validateMongoId('id'), updateAchievement);

// System Analytics and Statistics
router.get('/stats', getSystemStats);

// System Maintenance Routes
router.post('/cleanup/sessions', cleanupExpiredSessions);
router.get('/logs', getSystemLogs);

module.exports = router;