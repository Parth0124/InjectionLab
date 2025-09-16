const Session = require('../models/Session');
const sqliteService = require('./sqliteService');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class SandboxService {
  async createSession(userId, challengeId, templateName) {
    try {
      // Create SQLite database
      const sessionId = await sqliteService.createUserDatabase(userId, challengeId, templateName);

      // Create session record in MongoDB
      const session = new Session({
        sessionId,
        userId,
        challengeId,
        databasePath: `${sessionId}.db`,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

      await session.save();

      logger.info(`Created sandbox session: ${sessionId} for user: ${userId}`);

      return sessionId;
    } catch (error) {
      logger.error('Error creating sandbox session:', error);
      throw error;
    }
  }

  async executeQuery(sessionId, query, userId) {
    try {
      // Verify session belongs to user and is active
      const session = await Session.findOne({
        sessionId,
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!session) {
        throw new Error('Session not found or expired');
      }

      // Execute query
      const result = await sqliteService.executeQuery(sessionId, query);

      // Log query in session
      session.queries.push({
        query,
        result: JSON.stringify(result),
        executedAt: new Date()
      });

      await session.save();

      return result;
    } catch (error) {
      logger.error('Error executing query in sandbox:', error);
      throw error;
    }
  }

  async cleanupSession(sessionId) {
    try {
      await sqliteService.cleanupDatabase(sessionId);
      await Session.updateOne(
        { sessionId },
        { isActive: false }
      );

      logger.info(`Cleaned up session: ${sessionId}`);
    } catch (error) {
      logger.error('Error cleaning up session:', error);
    }
  }

  async cleanupExpiredSessions() {
    try {
      const expiredSessions = await Session.find({
        isActive: true,
        expiresAt: { $lt: new Date() }
      });

      for (const session of expiredSessions) {
        await this.cleanupSession(session.sessionId);
      }

      await sqliteService.cleanupExpiredSessions();

      logger.info(`Cleaned up ${expiredSessions.length} expired sessions`);
    } catch (error) {
      logger.error('Error during session cleanup:', error);
    }
  }
}

module.exports = new SandboxService();
