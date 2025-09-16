const { validationResult } = require('express-validator');
const sandboxService = require('../services/sandboxService');
const progressService = require('../services/progressService');
const educationalContentService = require('../services/educationalContentService');
const Challenge = require('../models/Challenge');
const Session = require('../models/Session');
const Progress = require('../models/Progress');
const logger = require('../utils/logger');

const startPracticeSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { challengeId } = req.body;
    const userId = req.user.id;

    // Verify challenge exists and is active
    const challenge = await Challenge.findOne({
      _id: challengeId,
      isActive: true
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or inactive'
      });
    }

    // Check if user already has an active session for this challenge
    const existingSession = await Session.findOne({
      userId,
      challengeId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (existingSession) {
      return res.json({
        success: true,
        sessionId: existingSession.sessionId,
        message: 'Existing session found',
        challenge: {
          title: challenge.title,
          description: challenge.description,
          level: challenge.level,
          category: challenge.category,
          hints: challenge.hints.map(hint => ({
            order: hint.order,
            pointDeduction: hint.pointDeduction
          }))
        }
      });
    }

    // Create new session
    const sessionId = await sandboxService.createSession(
      userId,
      challengeId,
      challenge.databaseSchema
    );

    // Get or create progress record
    let progress = await Progress.findOne({ userId, challengeId });
    if (!progress) {
      progress = new Progress({
        userId,
        challengeId,
        status: 'in-progress'
      });
      await progress.save();
    } else if (progress.status === 'not-started') {
      progress.status = 'in-progress';
      await progress.save();
    }

    logger.info(`Practice session started: ${sessionId} for user: ${userId}, challenge: ${challengeId}`);

    res.json({
      success: true,
      sessionId,
      message: 'Practice session started successfully',
      challenge: {
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        level: challenge.level,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        hints: challenge.hints.map(hint => ({
          order: hint.order,
          pointDeduction: hint.pointDeduction
        })),
        educationalContent: challenge.educationalContent
      }
    });

  } catch (error) {
    logger.error('Start practice session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting practice session'
    });
  }
};

const executeQuery = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { sessionId } = req.body;
    const query = req.sanitizedQuery;
    const userId = req.user.id;

    // Execute query in sandbox
    const result = await sandboxService.executeQuery(sessionId, query, userId);

    // Get session info to determine challenge
    const session = await Session.findOne({ 
      sessionId, 
      userId,
      isActive: true 
    }).populate('challengeId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or expired'
      });
    }

    // Analyze query result to determine if injection was successful
    const analysisResult = await analyzeQueryResult(
      query, 
      result, 
      session.challengeId
    );

    // Update progress
    const updatedProgress = await progressService.updateProgress(
      userId,
      session.challengeId._id,
      query,
      result,
      analysisResult.isSuccessful
    );

    // Prepare response
    const response = {
      success: true,
      result: {
        ...result,
        isInjectionSuccessful: analysisResult.isSuccessful,
        analysis: analysisResult.analysis,
        feedback: analysisResult.feedback,
        educationalTip: analysisResult.educationalTip
      },
      progress: {
        status: updatedProgress.status,
        attempts: updatedProgress.attempts.length,
        score: updatedProgress.score,
        hintsUsed: updatedProgress.hintsUsed.length
      }
    };

    // If challenge completed, include solution
    if (analysisResult.isSuccessful && updatedProgress.status === 'completed') {
      response.solution = {
        explanation: session.challengeId.solution.explanation,
        queries: session.challengeId.solution.queries
      };
    }

    logger.info(`Query executed for session ${sessionId}: ${analysisResult.isSuccessful ? 'successful' : 'failed'} injection`);

    res.json(response);

  } catch (error) {
    logger.error('Execute query error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while executing query'
    });
  }
};

const getHint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { challengeId, hintIndex } = req.body;
    const userId = req.user.id;

    // Validate hint index
    if (typeof hintIndex !== 'number' || hintIndex < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid hint index is required'
      });
    }

    const result = await progressService.useHint(userId, challengeId, hintIndex);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info(`Hint ${hintIndex} used by user ${userId} for challenge ${challengeId}`);

    res.json({
      success: true,
      hint: result.hint,
      pointDeduction: result.pointDeduction,
      message: 'Hint retrieved successfully'
    });

  } catch (error) {
    logger.error('Get hint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting hint'
    });
  }
};

const endSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { sessionId } = req.body;
    const userId = req.user.id;

    // Verify session belongs to user
    const session = await Session.findOne({
      sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await sandboxService.cleanupSession(sessionId);

    logger.info(`Session ${sessionId} ended by user ${userId}`);

    res.json({
      success: true,
      message: 'Session ended successfully'
    });

  } catch (error) {
    logger.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending session'
    });
  }
};

const getSessionInfo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({
      sessionId,
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('challengeId', 'title description level category difficulty');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or expired'
      });
    }

    const progress = await Progress.findOne({
      userId,
      challengeId: session.challengeId._id
    });

    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        challenge: session.challengeId,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        queryCount: session.queries.length
      },
      progress: progress ? {
        status: progress.status,
        attempts: progress.attempts.length,
        score: progress.score,
        hintsUsed: progress.hintsUsed.length
      } : null
    });

  } catch (error) {
    logger.error('Get session info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session info'
    });
  }
};

const getEducationalContent = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const content = await educationalContentService.getEducationalContent(challengeId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Educational content not found'
      });
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    logger.error('Get educational content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching educational content'
    });
  }
};

const getPreventionTechniques = async (req, res) => {
  try {
    const { category } = req.params;

    const techniques = await educationalContentService.getPreventionTechniques(category);
    
    if (!techniques) {
      return res.status(404).json({
        success: false,
        message: 'Prevention techniques not found for this category'
      });
    }

    res.json({
      success: true,
      techniques
    });

  } catch (error) {
    logger.error('Get prevention techniques error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching prevention techniques'
    });
  }
};

// Helper function to analyze query results
const analyzeQueryResult = async (query, result, challenge) => {
  const upperQuery = query.toUpperCase();
  const analysis = {
    isSuccessful: false,
    analysis: '',
    feedback: '',
    educationalTip: ''
  };

  if (!result.success) {
    analysis.feedback = `Query failed: ${result.error || 'Unknown error'}. Check your SQL syntax and try again.`;
    analysis.educationalTip = 'SQL errors often indicate syntax issues. Review the proper SQL injection syntax for this challenge level.';
    return analysis;
  }

  const hasResults = result.results && result.results.length > 0;
  
  // Determine success based on challenge category and query patterns
  switch (challenge.category) {
    case 'basic-bypass':
      analysis.isSuccessful = analyzeBasicBypass(upperQuery, hasResults);
      break;
    case 'information-disclosure':
      analysis.isSuccessful = analyzeInformationDisclosure(upperQuery, hasResults, result.results);
      break;
    case 'union-based':
      analysis.isSuccessful = analyzeUnionBased(upperQuery, hasResults, result.results);
      break;
    case 'boolean-blind':
      analysis.isSuccessful = analyzeBooleanBlind(upperQuery, hasResults);
      break;
    case 'time-based':
      analysis.isSuccessful = analyzeTimeBased(upperQuery);
      break;
    default:
      analysis.isSuccessful = hasResults;
  }

  // Generate feedback based on success and technique used
  if (analysis.isSuccessful) {
    analysis.feedback = generateSuccessFeedback(upperQuery, challenge.category);
    analysis.educationalTip = generateEducationalTip(challenge.category, true);
  } else {
    analysis.feedback = generateFailureFeedback(upperQuery, hasResults, challenge.category);
    analysis.educationalTip = generateEducationalTip(challenge.category, false);
  }

  analysis.analysis = generateTechnicalAnalysis(upperQuery, result, challenge.category);

  return analysis;
};

// Helper functions for different injection analysis types
const analyzeBasicBypass = (query, hasResults) => {
  const bypassPatterns = [
    /OR\s+['"]?1['"]?\s*=\s*['"]?1['"]?/,
    /OR\s+['"]?TRUE['"]?/,
    /'\s*OR\s*'/,
    /--/,
    /#/,
    /\/\*/
  ];
  
  return bypassPatterns.some(pattern => pattern.test(query)) && hasResults;
};

const analyzeInformationDisclosure = (query, hasResults, results) => {
  const disclosurePatterns = [
    /UNION\s+SELECT/,
    /UNION\s+ALL\s+SELECT/,
    /'\s*UNION/,
    /ORDER\s+BY/
  ];
  
  const hasUnion = disclosurePatterns.some(pattern => pattern.test(query));
  const hasMultipleColumns = results && results.length > 0 && 
    results.some(row => Object.keys(row).length > 2);
    
  return hasUnion && hasResults && hasMultipleColumns;
};

const analyzeUnionBased = (query, hasResults, results) => {
  const unionPattern = /UNION\s+(ALL\s+)?SELECT/;
  const hasUnion = unionPattern.test(query);
  
  // Check if results contain data that wouldn't normally be returned
  const hasExtraData = results && results.length > 0 &&
    results.some(row => 
      Object.values(row).some(value => 
        typeof value === 'string' && 
        (value.includes('@') || value.includes('admin') || value.includes('password'))
      )
    );
    
  return hasUnion && hasResults && hasExtraData;
};

const analyzeBooleanBlind = (query, hasResults) => {
  const blindPatterns = [
    /AND\s+\d+\s*=\s*\d+/,
    /AND\s+['"][^'"]*['"]=['"][^'"]*['"]/,
    /SUBSTR\(/,
    /SUBSTRING\(/,
    /ASCII\(/,
    /LENGTH\(/
  ];
  
  return blindPatterns.some(pattern => pattern.test(query));
};

const analyzeTimeBased = (query) => {
  const timePatterns = [
    /SLEEP\(/,
    /WAITFOR\s+DELAY/,
    /BENCHMARK\(/,
    /pg_sleep\(/
  ];
  
  return timePatterns.some(pattern => pattern.test(query));
};

// Feedback generation functions
const generateSuccessFeedback = (query, category) => {
  if (query.includes('UNION')) {
    return 'Excellent! You successfully used UNION-based injection to extract additional data from the database.';
  } else if (query.includes("OR '1'='1'") || query.includes('OR 1=1')) {
    return 'Great job! You bypassed the authentication using boolean logic manipulation.';
  } else if (query.includes('--') || query.includes('#')) {
    return 'Well done! You successfully used SQL comments to bypass the query logic.';
  } else {
    return 'Success! Your SQL injection was executed successfully.';
  }
};

const generateFailureFeedback = (query, hasResults, category) => {
  if (!hasResults) {
    return 'Your query executed but returned no results. The injection technique might need adjustment.';
  } else {
    return 'Query executed with results, but the injection objective was not achieved. Review the challenge requirements.';
  }
};

const generateEducationalTip = (category, isSuccessful) => {
  const tips = {
    'basic-bypass': {
      success: 'Remember: Always use parameterized queries in production to prevent this type of attack.',
      failure: 'Try using OR conditions to make the WHERE clause always true, or comment out the rest of the query.'
    },
    'information-disclosure': {
      success: 'This demonstrates why input validation and query whitelisting are crucial security measures.',
      failure: 'Use UNION SELECT to combine results from different tables. Ensure column counts match.'
    },
    'union-based': {
      success: 'UNION attacks can expose entire database schemas. Always validate and sanitize user inputs.',
      failure: 'UNION requires matching column numbers and compatible data types between queries.'
    },
    'boolean-blind': {
      success: 'Blind injection relies on application behavior differences. Implement consistent error handling.',
      failure: 'Boolean blind injection uses conditional statements to infer data based on true/false responses.'
    },
    'time-based': {
      success: 'Time-based attacks exploit database delay functions. Implement query timeouts as protection.',
      failure: 'Use database-specific delay functions like SLEEP() or WAITFOR DELAY to create time differences.'
    }
  };
  
  return tips[category] ? tips[category][isSuccessful ? 'success' : 'failure'] : 
    'Study the challenge requirements and SQL injection techniques for this category.';
};

const generateTechnicalAnalysis = (query, result, category) => {
  let analysis = `Query executed with ${result.results ? result.results.length : 0} results. `;
  
  if (query.includes('UNION')) {
    analysis += 'UNION statement detected - attempting to combine results from multiple queries. ';
  }
  
  if (query.includes('OR')) {
    analysis += 'OR condition detected - modifying query logic. ';
  }
  
  if (query.includes('--') || query.includes('#')) {
    analysis += 'Comment syntax detected - attempting to ignore remaining query. ';
  }
  
  return analysis;
};

module.exports = {
  startPracticeSession,
  executeQuery,
  getHint,
  endSession,
  getSessionInfo,
  getEducationalContent,
  getPreventionTechniques
};