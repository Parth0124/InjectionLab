const mongoose = require('mongoose');

// progress schema details
const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'failed'],
    default: 'not-started'
  },
  attempts: [{
    query: String,
    result: String,
    isSuccessful: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    },
    feedback: String
  }],
  hintsUsed: [{
    hintIndex: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: Date,
  feedback: {
    understanding: {
      type: Number,
      min: 1,
      max: 5
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
