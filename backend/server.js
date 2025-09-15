// import libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// import files/functions
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// import routes/endpoints
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const challengeRoutes = require('./routes/challenges');
const sqlInjectionRoutes = require('./routes/sqlInjection');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// mongodb connection
try {
  connectDB();
} catch (error) {
  logger.error('Error connecting to MongoDB:', error.message);
}

// cors config
app.use(helmet());
app.use(cors({ origin: '*' }));

// limit hit control fn
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// body parse middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// logs middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sql-injection', sqlInjectionRoutes);
app.use('/api/admin', adminRoutes);

// health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'InjectionLab Backend is running',
    timestamp: new Date().toISOString()
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// port opening
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
