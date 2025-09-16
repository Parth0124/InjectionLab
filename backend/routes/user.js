const express = require('express');
const {
  updateProfile,
  getUserProgress,
  getUserStats,
  changePassword,
  deleteAccount,
  getLeaderboard
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validatePasswordChange,
  validatePaginationParams
} = require('../middleware/validation');
const { passwordLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Get user progress
router.get('/progress', getUserProgress);

// Get user statistics and analytics
router.get('/stats', getUserStats);

// Update user profile
router.put('/profile', validateProfileUpdate, updateProfile);

// Change password (with rate limiting)
router.put('/password', passwordLimiter, validatePasswordChange, changePassword);

// Delete user account
router.delete('/account', deleteAccount);

// Get leaderboard
router.get('/leaderboard', validatePaginationParams, getLeaderboard);

module.exports = router;