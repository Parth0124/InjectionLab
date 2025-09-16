const mongoose = require('mongoose');

// challenge schema details
const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  category: {
    type: String,
    enum: ['basic-bypass', 'information-disclosure', 'union-based', 'boolean-blind', 'time-based'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  databaseSchema: {
    type: String,
    required: true // SQL file name for this challenge
  },
  hints: [{
    order: Number,
    text: String,
    pointDeduction: {
      type: Number,
      default: 0
    }
  }],
  solution: {
    queries: [String],
    explanation: String
  },
  educationalContent: {
    theory: String,
    examples: [String],
    prevention: String
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);