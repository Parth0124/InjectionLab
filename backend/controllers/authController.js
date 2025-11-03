const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Public signup - always creates student accounts
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, email, password, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Create new user with student role (ignore any role in request body)
    const user = new User({
      username,
      email,
      password,
      profile,
      role: 'student' // Always student for public registration
    });

    await user.save();

    // Generate token
    const token = generateToken({ id: user._id });

    logger.info(`New user registered: ${user.username}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Admin-only function to create privileged accounts
const createPrivilegedUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Check if requesting user is admin
    const requestingUser = await User.findById(req.user.id);
    
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can create instructor or admin accounts'
      });
    }

    const { username, email, password, profile, role } = req.body;

    // Validate role
    if (!role || !['instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "instructor" or "admin"'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Create new privileged user
    const user = new User({
      username,
      email,
      password,
      profile,
      role
    });

    await user.save();

    logger.info(`Admin ${requestingUser.username} created ${role} account: ${user.username}`);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      user
    });

  } catch (error) {
    logger.error('Create privileged user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account creation'
    });
  }
};

// login fn
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id });

    logger.info(`User logged in: ${user.username}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// fetch profile fn
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedChallenges', 'title level points')
      .populate('achievements', 'name description points');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  createPrivilegedUser
};