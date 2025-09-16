const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, endpoint: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000) / 1000)
    });
  }
});

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, endpoint: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
      retryAfter: 900
    });
  }
});

// Rate limiting for query execution (prevent SQL injection spam)
const queryLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 query executions per 5 minutes
  message: {
    success: false,
    message: 'Too many query executions from this IP, please slow down.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Query rate limit exceeded for IP: ${req.ip}, user: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      message: 'Too many query executions from this IP, please slow down.',
      retryAfter: 300
    });
  }
});

// Rate limiting for session creation
const sessionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 session creations per minute
  message: {
    success: false,
    message: 'Too many session creation attempts, please wait a moment.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Session creation rate limit exceeded for IP: ${req.ip}, user: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      message: 'Too many session creation attempts, please wait a moment.',
      retryAfter: 60
    });
  }
});

// Rate limiting for password change attempts
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password change attempts per hour
  message: {
    success: false,
    message: 'Too many password change attempts from this IP, please try again after an hour.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Password change rate limit exceeded for IP: ${req.ip}, user: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      message: 'Too many password change attempts from this IP, please try again after an hour.',
      retryAfter: 3600
    });
  }
});

// Dynamic rate limiter based on user role
const createRoleBasedLimiter = (studentMax, instructorMax, adminMax) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      if (!req.user) return studentMax; // Default to student limit for unauthenticated
      
      switch (req.user.role) {
        case 'admin':
          return adminMax;
        case 'instructor':
          return instructorMax;
        case 'student':
        default:
          return studentMax;
      }
    },
    message: (req) => ({
      success: false,
      message: `Rate limit exceeded for your user role. Please try again later.`,
      retryAfter: 900
    }),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Role-based rate limit exceeded for user: ${req.user?.id}, role: ${req.user?.role}, IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded for your user role. Please try again later.',
        retryAfter: 900
      });
    }
  });
};

// Skip rate limiting for certain conditions
const createConditionalLimiter = (limiter, skipCondition) => {
  return (req, res, next) => {
    if (skipCondition && skipCondition(req)) {
      return next();
    }
    return limiter(req, res, next);
  };
};

// Custom rate limiter with user-specific tracking
const createUserSpecificLimiter = (windowMs, maxRequests) => {
  const userAttempts = new Map();
  
  return (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean up old entries
    if (userAttempts.has(userId)) {
      const attempts = userAttempts.get(userId);
      const validAttempts = attempts.filter(timestamp => timestamp > windowStart);
      
      if (validAttempts.length === 0) {
        userAttempts.delete(userId);
      } else {
        userAttempts.set(userId, validAttempts);
      }
    }
    
    // Check current attempts
    const currentAttempts = userAttempts.get(userId) || [];
    
    if (currentAttempts.length >= maxRequests) {
      const oldestAttempt = Math.min(...currentAttempts);
      const resetTime = Math.ceil((oldestAttempt + windowMs - now) / 1000);
      
      logger.warn(`User-specific rate limit exceeded for user: ${userId}`);
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: resetTime
      });
    }
    
    // Add current attempt
    currentAttempts.push(now);
    userAttempts.set(userId, currentAttempts);
    
    next();
  };
};

// Progressive rate limiting (stricter limits after violations)
let violationCounts = new Map();

const progressiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    const key = req.user?.id || req.ip;
    const violations = violationCounts.get(key) || 0;
    
    // Base limit decreases with violations
    const baseLimit = 100;
    const reduction = Math.min(violations * 10, 80); // Max 80% reduction
    return Math.max(baseLimit - reduction, 10); // Minimum 10 requests
  },
  message: {
    success: false,
    message: 'Rate limit exceeded. Repeated violations result in stricter limits.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  onLimitReached: (req) => {
    const key = req.user?.id || req.ip;
    const violations = violationCounts.get(key) || 0;
    violationCounts.set(key, violations + 1);
    
    logger.warn(`Progressive rate limit violation #${violations + 1} for ${key}`);
    
    // Clean up old violations periodically
    setTimeout(() => {
      const currentViolations = violationCounts.get(key) || 0;
      if (currentViolations > 1) {
        violationCounts.set(key, currentViolations - 1);
      } else {
        violationCounts.delete(key);
      }
    }, 60 * 60 * 1000); // Reduce violation count after 1 hour
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  queryLimiter,
  sessionLimiter,
  passwordLimiter,
  createRoleBasedLimiter,
  createConditionalLimiter,
  createUserSpecificLimiter,
  progressiveLimiter
};