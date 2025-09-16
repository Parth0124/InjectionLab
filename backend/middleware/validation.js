const { body, param, query, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim()
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('profile.firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces')
    .trim()
    .escape(),
  
  body('profile.lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
    .trim()
    .escape(),
  
  body('profile.institution')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Institution name cannot exceed 100 characters')
    .trim()
    .escape(),
  
  body('profile.level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters'),
  
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('profile.firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces')
    .trim()
    .escape(),
  
  body('profile.lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces')
    .trim()
    .escape(),
  
  body('profile.institution')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Institution name cannot exceed 100 characters')
    .trim()
    .escape(),
  
  body('profile.level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Challenge creation validation
const validateChallengeCreation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .trim(),
  
  body('level')
    .isInt({ min: 1, max: 5 })
    .withMessage('Level must be between 1 and 5'),
  
  body('category')
    .isIn(['basic-bypass', 'information-disclosure', 'union-based', 'boolean-blind', 'time-based'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('points')
    .isInt({ min: 0, max: 1000 })
    .withMessage('Points must be between 0 and 1000'),
  
  body('databaseSchema')
    .notEmpty()
    .withMessage('Database schema is required')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Database schema name can only contain letters, numbers, hyphens, and underscores')
    .isLength({ max: 50 })
    .withMessage('Database schema name cannot exceed 50 characters'),
  
  body('hints')
    .optional()
    .isArray()
    .withMessage('Hints must be an array'),
  
  body('hints.*.order')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Hint order must be a positive integer'),
  
  body('hints.*.text')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('Hint text must be between 5 and 500 characters'),
  
  body('hints.*.pointDeduction')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Point deduction must be between 0 and 100'),
  
  body('solution.queries')
    .optional()
    .isArray()
    .withMessage('Solution queries must be an array'),
  
  body('solution.explanation')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Solution explanation cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Challenge update validation
const validateChallengeUpdate = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters')
    .trim(),
  
  body('level')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Level must be between 1 and 5'),
  
  body('category')
    .optional()
    .isIn(['basic-bypass', 'information-disclosure', 'union-based', 'boolean-blind', 'time-based'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('points')
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage('Points must be between 0 and 1000'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

// Session start validation
const validateSessionStart = [
  body('challengeId')
    .notEmpty()
    .withMessage('Challenge ID is required')
    .isMongoId()
    .withMessage('Invalid challenge ID format'),
  
  handleValidationErrors
];

// Query execution validation
const validateQueryExecution = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
    .isUUID()
    .withMessage('Invalid session ID format'),
  
  body('query')
    .notEmpty()
    .withMessage('Query is required')
    .isLength({ min: 1, max: parseInt(process.env.MAX_QUERY_LENGTH) || 1000 })
    .withMessage(`Query must be between 1 and ${parseInt(process.env.MAX_QUERY_LENGTH) || 1000} characters`),
  
  handleValidationErrors
];

// Hint request validation
const validateHintRequest = [
  body('challengeId')
    .notEmpty()
    .withMessage('Challenge ID is required')
    .isMongoId()
    .withMessage('Invalid challenge ID format'),
  
  body('hintIndex')
    .isInt({ min: 0 })
    .withMessage('Hint index must be a non-negative integer'),
  
  handleValidationErrors
];

// Session end validation
const validateSessionEnd = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
    .isUUID()
    .withMessage('Invalid session ID format'),
  
  handleValidationErrors
];

// User role update validation
const validateUserRoleUpdate = [
  body('role')
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Role must be student, instructor, or admin'),
  
  handleValidationErrors
];

// User status update validation
const validateUserStatusUpdate = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

// Achievement creation validation
const validateAchievementCreation = [
  body('name')
    .notEmpty()
    .withMessage('Achievement name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Achievement name must be between 3 and 50 characters')
    .trim()
    .escape(),
  
  body('description')
    .notEmpty()
    .withMessage('Achievement description is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Achievement description must be between 10 and 200 characters')
    .trim(),
  
  body('category')
    .isIn(['completion', 'streak', 'speed', 'technique', 'special'])
    .withMessage('Invalid achievement category'),
  
  body('criteria')
    .notEmpty()
    .withMessage('Achievement criteria is required')
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        throw new Error('Criteria must be valid JSON');
      }
    }),
  
  body('points')
    .isInt({ min: 0, max: 500 })
    .withMessage('Achievement points must be between 0 and 500'),
  
  body('rarity')
    .optional()
    .isIn(['common', 'rare', 'epic', 'legendary'])
    .withMessage('Rarity must be common, rare, epic, or legendary'),
  
  handleValidationErrors
];

// Parameter validation helpers
const validateMongoId = (fieldName = 'id') => [
  param(fieldName)
    .isMongoId()
    .withMessage(`Invalid ${fieldName} format`),
  
  handleValidationErrors
];

const validateUUID = (fieldName = 'sessionId') => [
  param(fieldName)
    .isUUID()
    .withMessage(`Invalid ${fieldName} format`),
  
  handleValidationErrors
];

// Query parameter validation
const validatePaginationParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateFilterParams = [
  query('role')
    .optional()
    .isIn(['all', 'student', 'instructor', 'admin'])
    .withMessage('Role filter must be all, student, instructor, or admin'),
  
  query('status')
    .optional()
    .isIn(['all', 'active', 'inactive'])
    .withMessage('Status filter must be all, active, or inactive'),
  
  query('level')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Level filter must be between 1 and 5'),
  
  query('category')
    .optional()
    .isIn(['basic-bypass', 'information-disclosure', 'union-based', 'boolean-blind', 'time-based'])
    .withMessage('Invalid category filter'),
  
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty filter must be easy, medium, or hard'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  handleValidationErrors
];

// Custom validation functions
const validateSQLQuery = (req, res, next) => {
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Query must be a valid string'
    });
  }
  
  // Basic SQL syntax validation
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Query cannot be empty'
    });
  }
  
  // Check for potentially harmful patterns (beyond what sandbox already checks)
  const suspiciousPatterns = [
    /xp_cmdshell/i,
    /sp_execute/i,
    /openrowset/i,
    /opendatasource/i,
    /bulk\s+insert/i,
    /load_file/i,
    /into\s+outfile/i,
    /into\s+dumpfile/i
  ];
  
  const containsSuspicious = suspiciousPatterns.some(pattern => pattern.test(trimmedQuery));
  if (containsSuspicious) {
    logger.warn(`Suspicious SQL pattern detected in query by user ${req.user?.id}: ${trimmedQuery}`);
    return res.status(400).json({
      success: false,
      message: 'Query contains potentially harmful patterns'
    });
  }
  
  next();
};

// File upload validation (for future use)
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const file = req.files.file;
    
    // Check file size
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`
      });
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    next();
  };
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Basic sanitization for common XSS patterns
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };
  
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    } else if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    return obj;
  };
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

module.exports = {
  // User validation
  validateUserRegistration,
  validateUserLogin,
  validateProfileUpdate,
  validatePasswordChange,
  
  // Challenge validation
  validateChallengeCreation,
  validateChallengeUpdate,
  
  // SQL injection practice validation
  validateSessionStart,
  validateQueryExecution,
  validateHintRequest,
  validateSessionEnd,
  
  // Admin validation
  validateUserRoleUpdate,
  validateUserStatusUpdate,
  validateAchievementCreation,
  
  // Parameter validation
  validateMongoId,
  validateUUID,
  validatePaginationParams,
  validateFilterParams,
  
  // Custom validation
  validateSQLQuery,
  validateFileUpload,
  sanitizeInput,
  
  // Helper
  handleValidationErrors
};