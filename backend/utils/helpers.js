const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

// Generate random string
const generateRandomString = (length = 32, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

// Generate secure random token
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash data using SHA-256
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Format date for display
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// Get relative time (e.g., "2 hours ago")
const getRelativeTime = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
};

// Sleep/delay function for async operations
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Deep clone object
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

// Merge objects deeply
const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

// Check if value is object
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Capitalize first letter
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert string to title case
const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Convert camelCase to snake_case
const camelToSnake = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Convert snake_case to camelCase
const snakeToCamel = (str) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
};

// Remove undefined and null values from object
const removeEmpty = (obj) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedCleaned = removeEmpty(value);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
};

// Paginate array
const paginate = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit,
      hasNext: endIndex < array.length,
      hasPrev: page > 1
    }
  };
};

// Group array by key
const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

// Sort array of objects by multiple keys
const sortBy = (array, ...keys) => {
  return array.sort((a, b) => {
    for (const key of keys) {
      let aVal = a[key];
      let bVal = b[key];
      
      // Handle nested keys (e.g., 'user.name')
      if (key.includes('.')) {
        const keyParts = key.split('.');
        aVal = keyParts.reduce((obj, k) => obj?.[k], a);
        bVal = keyParts.reduce((obj, k) => obj?.[k], b);
      }
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
};

// Generate file path safely
const generateSafeFilePath = (basePath, fileName) => {
  // Remove dangerous characters and path traversal attempts
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return path.join(basePath, safeName);
};

// Check if file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Get file size
const getFileSize = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    throw new Error(`Unable to get file size: ${error.message}`);
  }
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate and parse JSON safely
const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};

// Generate unique filename
const generateUniqueFilename = (originalName, extension = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = extension || path.extname(originalName);
  const name = path.basename(originalName, ext);
  
  return `${name}_${timestamp}_${random}${ext}`;
};

// Calculate percentage
const calculatePercentage = (value, total, decimals = 2) => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

// Generate progress bar string
const generateProgressBar = (current, total, length = 20) => {
  const percentage = current / total;
  const filled = Math.round(length * percentage);
  const empty = length - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty);
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }
};

// Generate error response
const createErrorResponse = (message, statusCode = 500, errors = []) => {
  return {
    success: false,
    message,
    statusCode,
    errors,
    timestamp: new Date().toISOString()
  };
};

// Generate success response
const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// Mask sensitive data (e.g., email, phone)
const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return email;
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 2 
    ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    : username;
    
  return `${maskedUsername}@${domain}`;
};

const maskPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return phone;
  
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  return digits.slice(0, -4).replace(/\d/g, '*') + digits.slice(-4);
};

// Check if environment is development
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Check if environment is production
const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Get environment variable with default
const getEnvVar = (name, defaultValue = '') => {
  return process.env[name] || defaultValue;
};

// Convert object to query string
const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      params.append(key, value.toString());
    }
  }
  
  return params.toString();
};

// Parse query string to object
const queryStringToObject = (queryString) => {
  const params = new URLSearchParams(queryString);
  const obj = {};
  
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  
  return obj;
};

// Validate required fields
const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Clean up temporary files
const cleanupTempFiles = async (tempDir, maxAge = 3600000) => { // 1 hour default
  try {
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    // Ignore errors - cleanup is best effort
  }
};

module.exports = {
  generateRandomString,
  generateSecureToken,
  hashData,
  formatDate,
  getRelativeTime,
  sleep,
  deepClone,
  deepMerge,
  isObject,
  capitalize,
  toTitleCase,
  camelToSnake,
  snakeToCamel,
  removeEmpty,
  paginate,
  groupBy,
  sortBy,
  generateSafeFilePath,
  fileExists,
  getFileSize,
  formatFileSize,
  safeJsonParse,
  generateUniqueFilename,
  calculatePercentage,
  generateProgressBar,
  debounce,
  throttle,
  retryWithBackoff,
  createErrorResponse,
  createSuccessResponse,
  maskEmail,
  maskPhone,
  isDevelopment,
  isProduction,
  getEnvVar,
  objectToQueryString,
  queryStringToObject,
  validateRequiredFields,
  cleanupTempFiles
};