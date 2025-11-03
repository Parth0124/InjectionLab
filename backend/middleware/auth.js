const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../config/jwt');

// Authenticate middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = { id: user._id, role: user.role };
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// NEW: Flexible authorize middleware - takes multiple roles
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      // req.user is set by authenticate middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(req.user.id);
      
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. ${roles.join(' or ')} privileges required.`
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during authorization'
      });
    }
  };
};

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization'
    });
  }
};

// Instructor or admin middleware
const instructorOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructor or Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization'
    });
  }
};

module.exports = {
  authenticate,
  authorize,        // ADD THIS
  adminOnly,
  instructorOrAdmin
};