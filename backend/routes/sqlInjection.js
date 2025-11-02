const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validateQuery } = require('../middleware/sandbox');
const {
  startPracticeSession,
  executeQuery,
  getHint,
  endSession,
  getSessionInfo,
  getEducationalContent,
  getPreventionTechniques
} = require('../controllers/sqlInjectionController');

const router = express.Router();

// Practice session routes
router.post('/session/start', 
  authenticate, 
  [
    body('challengeId').notEmpty().withMessage('Challenge ID is required')
  ],
  startPracticeSession
);

router.post('/session/end', 
  authenticate,
  [
    body('sessionId').notEmpty().withMessage('Session ID is required')
  ],
  endSession
);

router.get('/session/:sessionId', 
  authenticate, 
  getSessionInfo
);

// Query execution route
router.post('/execute',
  authenticate,
  [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('query').notEmpty().withMessage('Query is required')
  ],
  validateQuery,
  executeQuery
);

// Hint route
router.post('/hint', 
  authenticate,
  [
    body('challengeId').notEmpty().withMessage('Challenge ID is required'),
    body('hintIndex').exists().withMessage('Hint index is required')
  ],
  getHint
);

// Educational content routes
router.get('/educational-content/:challengeId',
  authenticate,
  getEducationalContent
);

router.get('/prevention-techniques/:category',
  authenticate,
  getPreventionTechniques
);

module.exports = router;