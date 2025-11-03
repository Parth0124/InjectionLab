const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, createPrivilegedUser } = require('../controllers/authController');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Register validation
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Privileged user creation validation (includes role)
const privilegedUserValidation = [
  ...registerValidation,
  body('role')
    .isIn(['instructor', 'admin'])
    .withMessage('Role must be either "instructor" or "admin"')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

// Admin-only routes
router.post('/create-privileged-user', authenticate, adminOnly, privilegedUserValidation, createPrivilegedUser);

module.exports = router;