const User = require('../models/User');
const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// update profile fn
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { profile } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { profile } },
      { new: true, runValidators: true }
    ).populate('completedChallenges', 'title level points')
     .populate('achievements', 'name description points');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`Profile updated for user: ${user.username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// fetch user progress fn
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await Progress.find({ userId })
      .populate('challengeId', 'title level difficulty category points')
      .sort({ updatedAt: -1 });

    const stats = {
      totalChallenges: await Challenge.countDocuments({ isActive: true }),
      completedChallenges: progress.filter(p => p.status === 'completed').length,
      totalScore: req.user.totalScore,
      averageScore: 0
    };

    const completedProgress = progress.filter(p => p.status === 'completed');
    if (completedProgress.length > 0) {
      stats.averageScore = Math.round(
        completedProgress.reduce((sum, p) => sum + p.score, 0) / completedProgress.length
      );
    }

    res.json({
      success: true,
      progress,
      stats
    });
  } catch (error) {
    logger.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress'
    });
  }
};

// user stats fn
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId)
      .populate('completedChallenges', 'title level points')
      .populate('achievements', 'name description points category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const progress = await Progress.find({ userId });
    
    const stats = {
      totalScore: user.totalScore,
      completedChallenges: user.completedChallenges.length,
      totalChallenges: await Challenge.countDocuments({ isActive: true }),
      achievements: user.achievements.length,
      levelDistribution: {
        level1: user.completedChallenges.filter(c => c.level === 1).length,
        level2: user.completedChallenges.filter(c => c.level === 2).length,
        level3: user.completedChallenges.filter(c => c.level === 3).length,
        level4: user.completedChallenges.filter(c => c.level === 4).length,
        level5: user.completedChallenges.filter(c => c.level === 5).length
      },
      recentActivity: progress
        .filter(p => p.status === 'completed')
        .sort((a, b) => b.completedAt - a.completedAt)
        .slice(0, 5)
        .map(p => ({
          challengeTitle: p.challengeId?.title || 'Unknown Challenge',
          completedAt: p.completedAt,
          score: p.score
        }))
    };

    res.json({
      success: true,
      stats,
      user: {
        username: user.username,
        email: user.email,
        profile: user.profile,
        totalScore: user.totalScore,
        achievements: user.achievements,
        completedChallenges: user.completedChallenges
      }
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
};

// change password fn
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.username}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
};

// delete account fn
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's progress records
    await Progress.deleteMany({ userId });

    // Delete user account
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info(`Account deleted for user: ${user.username}`);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
};

// get leaderboard fn
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await User.find({ 
      role: 'student',
      isActive: true 
    })
    .select('username profile.firstName profile.lastName totalScore completedChallenges')
    .populate('completedChallenges', 'level')
    .sort({ totalScore: -1 })
    .limit(parseInt(limit));

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      fullName: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
      totalScore: user.totalScore,
      completedChallenges: user.completedChallenges.length,
      highestLevel: user.completedChallenges.length > 0 
        ? Math.max(...user.completedChallenges.map(c => c.level))
        : 0
    }));

    res.json({
      success: true,
      leaderboard: leaderboardWithRank
    });
  } catch (error) {
    logger.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
};

module.exports = {
  updateProfile,
  getUserProgress,
  getUserStats,
  changePassword,
  deleteAccount,
  getLeaderboard
};