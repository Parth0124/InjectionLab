const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { SQLITE_DB_PATH, TEMP_DB_PATH, QUERY_TIMEOUT } = require('../config/sandbox');
const logger = require('../utils/logger');

class SQLiteService {
  constructor() {
    this.activeDatabases = new Map();
  }

  async createUserDatabase(userId, challengeId, templateName) {
    try {
      const sessionId = uuidv4();
      
      // Fix: Handle templateName that may or may not include .sql extension
      // Remove .sql extension if it exists, then add it back to avoid double extension
      const cleanTemplateName = templateName.replace(/\.sql$/, '');
      const templatePath = path.join(SQLITE_DB_PATH, 'templates', `${cleanTemplateName}.sql`);
      const userDbPath = path.join(TEMP_DB_PATH, `${sessionId}.db`);

      // Ensure temp directory exists
      await fs.mkdir(TEMP_DB_PATH, { recursive: true });

      // Create new database
      const db = new sqlite3.Database(userDbPath);

      // Read and execute template SQL
      const templateSQL = await fs.readFile(templatePath, 'utf8');
      
      await new Promise((resolve, reject) => {
        db.exec(templateSQL, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Store database reference
      this.activeDatabases.set(sessionId, {
        db,
        path: userDbPath,
        userId,
        challengeId,
        createdAt: new Date(),
        lastAccessed: new Date()
      });

      logger.info(`Created user database: ${sessionId} for user: ${userId}`);
      return sessionId;
    } catch (error) {
      logger.error('Error creating user database:', error);
      throw error;
    }
  }

  async executeQuery(sessionId, query) {
    try {
      const dbInfo = this.activeDatabases.get(sessionId);
      
      if (!dbInfo) {
        throw new Error('Database session not found or expired');
      }

      dbInfo.lastAccessed = new Date();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Query timeout'));
        }, QUERY_TIMEOUT);

        dbInfo.db.all(query, (err, rows) => {
          clearTimeout(timeout);
          
          if (err) {
            logger.error(`Query execution error for session ${sessionId}:`, err);
            resolve({
              success: false,
              error: err.message,
              results: []
            });
          } else {
            resolve({
              success: true,
              results: rows || [],
              rowCount: rows ? rows.length : 0
            });
          }
        });
      });
    } catch (error) {
      logger.error('Execute query error:', error);
      throw error;
    }
  }

  async cleanupDatabase(sessionId) {
    try {
      const dbInfo = this.activeDatabases.get(sessionId);
      
      if (dbInfo) {
        dbInfo.db.close();
        await fs.unlink(dbInfo.path).catch(() => {}); // Ignore errors if file doesn't exist
        this.activeDatabases.delete(sessionId);
        logger.info(`Cleaned up database session: ${sessionId}`);
      }
    } catch (error) {
      logger.error('Error cleaning up database:', error);
    }
  }

  async cleanupExpiredSessions() {
    const now = new Date();
    const expirationTime = 30 * 60 * 1000; // 30 minutes

    for (const [sessionId, dbInfo] of this.activeDatabases.entries()) {
      if (now - dbInfo.lastAccessed > expirationTime) {
        await this.cleanupDatabase(sessionId);
      }
    }
  }
}

module.exports = new SQLiteService();