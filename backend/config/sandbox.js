const path = require('path');
require('dotenv').config();

module.exports = {
  SQLITE_DB_PATH: path.join(__dirname, '..', process.env.SQLITE_DB_PATH || './sandbox/databases/'),
  TEMP_DB_PATH: path.join(__dirname, '..', process.env.TEMP_DB_PATH || './sandbox/temp/'),
  MAX_QUERY_LENGTH: parseInt(process.env.MAX_QUERY_LENGTH) || 1000,
  QUERY_TIMEOUT: parseInt(process.env.QUERY_TIMEOUT) || 5000,
  ALLOWED_COMMANDS: ['SELECT', 'UNION', 'ORDER BY', 'WHERE'],
  BLOCKED_COMMANDS: ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER', 'TRUNCATE'],
  MAX_RESULTS: 100,
  SESSION_CLEANUP_INTERVAL: 30 * 60 * 1000, // 30 minutes
};
