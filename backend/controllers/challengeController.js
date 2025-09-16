const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// fetch all challenges fn
const getAllChallenges = async (req, res) => {
  try {
    const { level, category, difficulty } = req.query;
    const filter = { isActive: true };

    if (level) filter.level = parseInt(level);
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter)
      .select('-solution') // Hide solutions from students
      .populate('createdBy', 'username')
      .sort({ level: 1, createdAt: 1 });

    // Get user's progress for each challenge
    const userProgress = await Progress.find({
      userId: req.user.id,
      challengeId: { $in: challenges.map(c => c._id) }
    });

    const progressMap = {};
    userProgress.forEach(p => {
      progressMap[p.challengeId] = p.status;
    });

    const challengesWithProgress = challenges.map(challenge => ({
      ...challenge.toObject(),
      userProgress: progressMap[challenge._id] || 'not-started'
    }));

    res.json({
      success: true,
      challenges: challengesWithProgress
    });

  } catch (error) {
    logger.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching challenges'
    });
  }
};

// fetch particular challenge
const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findOne({
      _id: id,
      isActive: true
    }).select('-solution').populate('createdBy', 'username');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    const progress = await Progress.findOne({
      userId: req.user.id,
      challengeId: id
    });

    res.json({
      success: true,
      challenge: {
        ...challenge.toObject(),
        userProgress: progress || null
      }
    });

  } catch (error) {
    logger.error('Get challenge by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching challenge'
    });
  }
};

// create challenge fn
const createChallenge = async (req, res) => {
  try {
    // Only instructors and admins can create challenges
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors and admins can create challenges'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const challengeData = {
      ...req.body,
      createdBy: req.user.id
    };

    const challenge = new Challenge(challengeData);
    await challenge.save();

    logger.info(`New challenge created: ${challenge.title} by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      challenge
    });

  } catch (error) {
    logger.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating challenge'
    });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  createChallenge
};
