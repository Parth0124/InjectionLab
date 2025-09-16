const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const Session = require('../models/Session');
const Achievement = require('../models/Achievement');
const sandboxService = require('../services/sandboxService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// User Management Functions
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (status && status !== 'all') {
      filter.isActive = status === 'active';
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('completedChallenges', 'title level')
      .populate('achievements', 'name category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`User ${user.username} status updated to ${isActive ? 'active' : 'inactive'} by admin ${req.user.username}`);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`User ${user.username} role updated to ${role} by admin ${req.user.username}`);

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated data
    await Progress.deleteMany({ userId });
    await Session.updateMany({ userId }, { isActive: false });

    // Delete user
    await User.findByIdAndDelete(userId);

    logger.info(`User ${user.username} deleted by admin ${req.user.username}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

// Challenge Management Functions
const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    logger.info(`Challenge ${challenge.title} updated by admin ${req.user.username}`);

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      challenge
    });
  } catch (error) {
    logger.error('Update challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating challenge'
    });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Instead of deleting, deactivate the challenge
    challenge.isActive = false;
    await challenge.save();

    logger.info(`Challenge ${challenge.title} deactivated by admin ${req.user.username}`);

    res.json({
      success: true,
      message: 'Challenge deactivated successfully'
    });
  } catch (error) {
    logger.error('Delete challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting challenge'
    });
  }
};

// Analytics and Statistics Functions
const getSystemStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        active: await User.countDocuments({ isActive: true }),
        students: await User.countDocuments({ role: 'student' }),
        instructors: await User.countDocuments({ role: 'instructor' }),
        admins: await User.countDocuments({ role: 'admin' })
      },
      challenges: {
        total: await Challenge.countDocuments(),
        active: await Challenge.countDocuments({ isActive: true }),
        byLevel: {
          level1: await Challenge.countDocuments({ level: 1, isActive: true }),
          level2: await Challenge.countDocuments({ level: 2, isActive: true }),
          level3: await Challenge.countDocuments({ level: 3, isActive: true }),
          level4: await Challenge.countDocuments({ level: 4, isActive: true }),
          level5: await Challenge.countDocuments({ level: 5, isActive: true })
        },
        byCategory: {
          basicBypass: await Challenge.countDocuments({ category: 'basic-bypass', isActive: true }),
          informationDisclosure: await Challenge.countDocuments({ category: 'information-disclosure', isActive: true }),
          unionBased: await Challenge.countDocuments({ category: 'union-based', isActive: true }),
          booleanBlind: await Challenge.countDocuments({ category: 'boolean-blind', isActive: true }),
          timeBased: await Challenge.countDocuments({ category: 'time-based', isActive: true })
        }
      },
      progress: {
        totalAttempts: await Progress.countDocuments(),
        completedChallenges: await Progress.countDocuments({ status: 'completed' }),
        inProgress: await Progress.countDocuments({ status: 'in-progress' })
      },
      sessions: {
        activeSessions: await Session.countDocuments({ 
          isActive: true,
          expiresAt: { $gt: new Date() }
        }),
        totalSessions: await Session.countDocuments()
      }
    };

    // Recent activity
    const recentUsers = await User.find()
      .select('username createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCompletions = await Progress.find({ status: 'completed' })
      .populate('userId', 'username')
      .populate('challengeId', 'title')
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats,
      recentActivity: {
        newUsers: recentUsers,
        recentCompletions
      }
    });
  } catch (error) {
    logger.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system statistics'
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('completedChallenges', 'title level points')
      .populate('achievements', 'name description category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const progress = await Progress.find({ userId })
      .populate('challengeId', 'title level category difficulty')
      .sort({ updatedAt: -1 });

    const sessions = await Session.find({ userId })
      .populate('challengeId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user,
      progress,
      recentSessions: sessions
    });
  } catch (error) {
    logger.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user details'
    });
  }
};

// Achievement Management
const createAchievement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const achievement = new Achievement(req.body);
    await achievement.save();

    logger.info(`Achievement ${achievement.name} created by admin ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      achievement
    });
  } catch (error) {
    logger.error('Create achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating achievement'
    });
  }
};

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .sort({ category: 1, points: 1 });

    res.json({
      success: true,
      achievements
    });
  } catch (error) {
    logger.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const achievement = await Achievement.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    logger.info(`Achievement ${achievement.name} updated by admin ${req.user.username}`);

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      achievement
    });
  } catch (error) {
    logger.error('Update achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating achievement'
    });
  }
};

// System Maintenance
const cleanupExpiredSessions = async (req, res) => {
  try {
    await sandboxService.cleanupExpiredSessions();
    
    const expiredCount = await Session.countDocuments({
      isActive: false,
      expiresAt: { $lt: new Date() }
    });

    logger.info(`Manual cleanup performed by admin ${req.user.username} - ${expiredCount} expired sessions cleaned`);

    res.json({
      success: true,
      message: `Cleanup completed. ${expiredCount} expired sessions cleaned.`
    });
  } catch (error) {
    logger.error('Cleanup expired sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cleaning up expired sessions'
    });
  }
};

const getSystemLogs = async (req, res) => {
  try {
    const { level = 'info', limit = 100 } = req.query;
    
    // This is a simplified implementation
    // In a real system, you'd query your logging system
    res.json({
      success: true,
      message: 'System logs retrieved',
      logs: [
        {
          timestamp: new Date(),
          level: 'info',
          message: 'System logs endpoint accessed',
          service: 'injectionlab-backend'
        }
      ]
    });
  } catch (error) {
    logger.error('Get system logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system logs'
    });
  }
};

module.exports = {
  // User Management
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getUserDetails,

  // Challenge Management  
  updateChallenge,
  deleteChallenge,

  // Achievement Management
  createAchievement,
  getAllAchievements,
  updateAchievement,

  // Analytics and Statistics
  getSystemStats,

  // System Maintenance
  cleanupExpiredSessions,
  getSystemLogs
};