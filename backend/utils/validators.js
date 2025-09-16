const validator = require('validator');
const mongoose = require('mongoose');

// Email validation
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email) && email.length <= 100;
};

// Password strength validation
const isStrongPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }
  
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Optional: Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password should contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Username validation
const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      errors: ['Username is required']
    };
  }
  
  const errors = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 30) {
    errors.push('Username cannot exceed 30 characters');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  // Check for reserved usernames
  const reservedUsernames = [
    'admin', 'administrator', 'root', 'system', 'api', 'www', 'mail',
    'email', 'support', 'help', 'info', 'contact', 'test', 'demo',
    'guest', 'public', 'private', 'null', 'undefined'
  ];
  
  if (reservedUsernames.includes(username.toLowerCase())) {
    errors.push('This username is reserved and cannot be used');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// MongoDB ObjectId validation
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// UUID validation
const isValidUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  return validator.isUUID(uuid);
};

// SQL query basic validation (for educational purposes)
const isValidSQLQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      errors: ['Query is required']
    };
  }
  
  const errors = [];
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    errors.push('Query cannot be empty');
  }
  
  if (trimmedQuery.length > (parseInt(process.env.MAX_QUERY_LENGTH) || 1000)) {
    errors.push(`Query cannot exceed ${parseInt(process.env.MAX_QUERY_LENGTH) || 1000} characters`);
  }
  
  // Check for extremely dangerous patterns (even for educational use)
  const dangerousPatterns = [
    /xp_cmdshell/i,
    /sp_execute/i,
    /openrowset/i,
    /opendatasource/i,
    /load_file\(/i,
    /into\s+outfile/i,
    /into\s+dumpfile/i,
    /exec\s*\(/i,
    /system\s*\(/i,
    /shell_exec/i,
    /passthru/i,
    /eval\s*\(/i
  ];
  
  const containsDangerous = dangerousPatterns.some(pattern => pattern.test(trimmedQuery));
  if (containsDangerous) {
    errors.push('Query contains potentially harmful patterns');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: containsDangerous ? ['Query contains suspicious patterns'] : []
  };
};

// Name validation (first name, last name)
const isValidName = (name) => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  return trimmedName.length >= 1 && 
         trimmedName.length <= 50 && 
         /^[a-zA-Z\s'-]+$/.test(trimmedName);
};

// Institution name validation
const isValidInstitution = (institution) => {
  if (!institution) {
    return true; // Optional field
  }
  
  if (typeof institution !== 'string') {
    return false;
  }
  
  const trimmedInstitution = institution.trim();
  return trimmedInstitution.length <= 100 && 
         /^[a-zA-Z0-9\s\-.,()&]+$/.test(trimmedInstitution);
};

// File upload validation
const isValidFileUpload = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return {
      isValid: false,
      errors: ['File is required']
    };
  }
  
  const errors = [];
  
  if (file.size > maxSize) {
    errors.push(`File size cannot exceed ${Math.round(maxSize / (1024 * 1024))}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check for potential malicious files
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js'];
  const fileName = file.originalname || file.name || '';
  const hasExt = dangerousExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  
  if (hasExt) {
    errors.push('File type is not allowed for security reasons');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation
const isValidURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  });
};

// Phone number validation (basic international format)
const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

// Date validation
const isValidDate = (date) => {
  if (!date) {
    return false;
  }
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Pagination parameters validation
const validatePaginationParams = (page, limit) => {
  const errors = [];
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    errors.push('Page must be a positive integer');
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    page: Math.max(pageNum || 1, 1),
    limit: Math.min(Math.max(limitNum || 20, 1), 100)
  };
};

// Search query validation
const isValidSearchQuery = (search) => {
  if (!search) {
    return true; // Optional
  }
  
  if (typeof search !== 'string') {
    return false;
  }
  
  const trimmedSearch = search.trim();
  return trimmedSearch.length >= 1 && 
         trimmedSearch.length <= 50 &&
         !/[<>\"'%;()&+]/.test(trimmedSearch); // Basic XSS prevention
};

// JSON validation
const isValidJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
};

// Role validation
const isValidRole = (role) => {
  const validRoles = ['student', 'instructor', 'admin'];
  return validRoles.includes(role);
};

// Challenge category validation
const isValidChallengeCategory = (category) => {
  const validCategories = [
    'basic-bypass',
    'information-disclosure',
    'union-based',
    'boolean-blind',
    'time-based'
  ];
  return validCategories.includes(category);
};

// Difficulty level validation
const isValidDifficulty = (difficulty) => {
  const validDifficulties = ['easy', 'medium', 'hard'];
  return validDifficulties.includes(difficulty);
};

// Level validation (1-5)
const isValidLevel = (level) => {
  const levelNum = parseInt(level);
  return !isNaN(levelNum) && levelNum >= 1 && levelNum <= 5;
};

// Points validation
const isValidPoints = (points) => {
  const pointsNum = parseInt(points);
  return !isNaN(pointsNum) && pointsNum >= 0 && pointsNum <= 1000;
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return validator.escape(input);
};

// Validate achievement criteria
const isValidAchievementCriteria = (criteria) => {
  if (!criteria || typeof criteria !== 'string') {
    return false;
  }
  
  try {
    const parsed = JSON.parse(criteria);
    return typeof parsed === 'object' && parsed !== null;
  } catch (error) {
    return false;
  }
};

// IP address validation
const isValidIP = (ip) => {
  return validator.isIP(ip);
};

// Rate limit key validation
const isValidRateLimitKey = (key) => {
  return typeof key === 'string' && 
         key.length >= 3 && 
         key.length <= 50 &&
         /^[a-zA-Z0-9-_]+$/.test(key);
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  isValidObjectId,
  isValidUUID,
  isValidSQLQuery,
  isValidName,
  isValidInstitution,
  isValidFileUpload,
  isValidURL,
  isValidPhoneNumber,
  isValidDate,
  validatePaginationParams,
  isValidSearchQuery,
  isValidJSON,
  isValidRole,
  isValidChallengeCategory,
  isValidDifficulty,
  isValidLevel,
  isValidPoints,
  sanitizeInput,
  isValidAchievementCriteria,
  isValidIP,
  isValidRateLimitKey
};