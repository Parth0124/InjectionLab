const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validateQuery } = require('../middleware/sandbox');
const sandboxService = require('../services/sandboxService');
const progressService = require('../services/progressService');
const Challenge = require('../models/Challenge');
const logger = require('../utils/logger');

const router = express.Router();

// Start practice session
router.post('/session/start', authenticate, async (req, res) => {
  try {
    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID is required'
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    const sessionId = await sandboxService.createSession(
      req.user.id,
      challengeId,
      challenge.databaseSchema
    );

    res.json({
      success: true,
      sessionId,
      message: 'Practice session started successfully'
    });

  } catch (error) {
    logger.error('Error starting practice session:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting practice session'
    });
  }
});

// Execute query
router.post('/execute',
  authenticate,
  [body('sessionId').notEmpty().withMessage('Session ID is required')],
  validateQuery,
  async (req, res) => {
    try {
      const { sessionId } = req.body;
      const query = req.sanitizedQuery;

      const result = await sandboxService.executeQuery(sessionId, query, req.user.id);

      // Determine if the injection was successful
      // This is a simplified check - in reality, you'd have more sophisticated logic
      const isSuccessful = result.success && result.results.length > 0;

      // Update progress
      const session = await require('../models/Session').findOne({ sessionId });
      if (session) {
        await progressService.updateProgress(
          req.user.id,
          session.challengeId,
          query,
          result,
          isSuccessful
        );
      }

      res.json({
        success: true,
        result: {
          ...result,
          isInjectionSuccessful: isSuccessful
        }
      });

    } catch (error) {
      logger.error('Error executing query:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error executing query'
      });
    }
  }
);

// Get hint
router.post('/hint', authenticate, async (req, res) => {
  try {
    const { challengeId, hintIndex } = req.body;

    if (!challengeId || hintIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID and hint index are required'
      });
    }

    const result = await progressService.useHint(req.user.id, challengeId, hintIndex);

    res.json(result);

  } catch (error) {
    logger.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting hint'
    });
  }
});

// End session
router.post('/session/end', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    await sandboxService.cleanupSession(sessionId);

    res.json({
      success: true,
      message: 'Session ended successfully'
    });

  } catch (error) {
    logger.error('Error ending session:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending session'
    });
  }
});

module.exports = router;
