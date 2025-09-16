const { BLOCKED_COMMANDS, MAX_QUERY_LENGTH } = require('../config/sandbox');
const logger = require('../utils/logger');

const validateQuery = (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query is required and must be a string'
      });
    }

    // quwery length check
    if (query.length > MAX_QUERY_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Query too long. Maximum length is ${MAX_QUERY_LENGTH} characters`
      });
    }

    // check block commands
    const upperQuery = query.toUpperCase();
    for (const blockedCmd of BLOCKED_COMMANDS) {
      if (upperQuery.includes(blockedCmd)) {
        logger.warn(`Blocked query attempt by user ${req.user.id}: ${query}`);
        return res.status(400).json({
          success: false,
          message: `Query contains blocked command: ${blockedCmd}`
        });
      }
    }

    // sql injection patterns
    const suspiciousPatterns = [
      /UNION\s+SELECT/i,
      /OR\s+1\s*=\s*1/i,
      /;\s*DROP/i,
      /'\s*OR\s*'/i
    ];

    const containsSuspicious = suspiciousPatterns.some(pattern => pattern.test(query));
    if (containsSuspicious) {
      logger.info(`Potential SQL injection attempt by user ${req.user.id}: ${query}`);
    }

    req.sanitizedQuery = query.trim();
    next();

  } catch (error) {
    logger.error('Query validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating query'
    });
  }
};

module.exports = {
  validateQuery
};
