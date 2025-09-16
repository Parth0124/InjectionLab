const express = require('express');
const { body } = require('express-validator');
const { getAllChallenges, getChallengeById, createChallenge } = require('../controllers/challengeController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Challenge creation validation
const createChallengeValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('level').isInt({ min: 1, max: 5 }).withMessage('Level must be between 1 and 5'),
  body('category').isIn(['basic-bypass', 'information-disclosure', 'union-based', 'boolean-blind', 'time-based']).withMessage('Invalid category'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('points').isInt({ min: 0 }).withMessage('Points must be a positive integer'),
  body('databaseSchema').notEmpty().withMessage('Database schema is required')
];

// Routes
router.get('/', authenticate, getAllChallenges);
router.get('/:id', authenticate, getChallengeById);
router.post('/', authenticate, authorize('instructor', 'admin'), createChallengeValidation, createChallenge);

module.exports = router;
