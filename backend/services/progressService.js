const Progress = require('../models/Progress');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Achievement = require('../models/Achievement');
const logger = require('../utils/logger');

class ProgressService {
  async updateProgress(userId, challengeId, query, result, isSuccessful) {
    try {
      let progress = await Progress.findOne({ userId, challengeId });

      if (!progress) {
        progress = new Progress({
          userId,
          challengeId,
          status: 'in-progress'
        });
      }

      // Add attempt
      progress.attempts.push({
        query,
        result: JSON.stringify(result),
        isSuccessful,
        timestamp: new Date(),
        feedback: this.generateFeedback(query, result, isSuccessful)
      });

      // Update status if successful
      if (isSuccessful && progress.status !== 'completed') {
        progress.status = 'completed';
        progress.completedAt = new Date();

        // Calculate score
        const challenge = await Challenge.findById(challengeId);
        let score = challenge.points;

        // Deduct points for hints used
        const hintDeduction = progress.hintsUsed.reduce((total, hint) => {
          return total + (challenge.hints[hint.hintIndex]?.pointDeduction || 0);
        }, 0);

        score = Math.max(0, score - hintDeduction);
        progress.score = score;

        // Update user's completed challenges and total score
        await User.findByIdAndUpdate(userId, {
          $addToSet: { completedChallenges: challengeId },
          $inc: { totalScore: score }
        });

        // Check for achievements
        await this.checkAchievements(userId);

        logger.info(`User ${userId} completed challenge ${challengeId} with score ${score}`);
      }

      await progress.save();
      return progress;

    } catch (error) {
      logger.error('Error updating progress:', error);
      throw error;
    }
  }

  async useHint(userId, challengeId, hintIndex) {
    try {
      let progress = await Progress.findOne({ userId, challengeId });

      if (!progress) {
        progress = new Progress({
          userId,
          challengeId,
          status: 'in-progress'
        });
      }

      // Check if hint already used
      const alreadyUsed = progress.hintsUsed.some(h => h.hintIndex === hintIndex);
      if (alreadyUsed) {
        return { success: false, message: 'Hint already used' };
      }

      progress.hintsUsed.push({
        hintIndex,
        timestamp: new Date()
      });

      await progress.save();

      const challenge = await Challenge.findById(challengeId);
      const hint = challenge.hints[hintIndex];

      return {
        success: true,
        hint: hint.text,
        pointDeduction: hint.pointDeduction
      };

    } catch (error) {
      logger.error('Error using hint:', error);
      throw error;
    }
  }

  generateFeedback(query, result, isSuccessful) {
    const upperQuery = query.toUpperCase();

    if (isSuccessful) {
      if (upperQuery.includes('UNION')) {
        return 'Great! You successfully used UNION-based injection to extract data.';
      } else if (upperQuery.includes("OR '1'='1'") || upperQuery.includes('OR 1=1')) {
        return 'Excellent! You bypassed authentication using boolean logic.';
      } else {
        return 'Well done! Your injection was successful.';
      }
    } else {
      if (result.error) {
        return `Query failed: ${result.error}. Try adjusting your syntax.`;
      } else if (result.results && result.results.length === 0) {
        return 'Query executed but returned no results. The injection might not be working as expected.';
      } else {
        return 'Query executed but the injection was not successful. Keep trying!';
      }
    }
  }

  async checkAchievements(userId) {
    try {
      const user = await User.findById(userId).populate('completedChallenges');
      const achievements = await Achievement.find({ isActive: true });

      for (const achievement of achievements) {
        const criteria = JSON.parse(achievement.criteria);
        let shouldAward = false;

        switch (achievement.category) {
          case 'completion':
            if (criteria.challengeCount && user.completedChallenges.length >= criteria.challengeCount) {
              shouldAward = true;
            }
            break;
          case 'speed':
            // Check if user completed challenge within time limit
            // Implementation depends on specific criteria
            break;
          case 'technique':
            // Check if user used specific SQL injection techniques
            // Implementation depends on specific criteria
            break;
        }

        if (shouldAward && !user.achievements.includes(achievement._id)) {
          user.achievements.push(achievement._id);
          user.totalScore += achievement.points;
          await user.save();

          logger.info(`User ${userId} earned achievement: ${achievement.name}`);
        }
      }

    } catch (error) {
      logger.error('Error checking achievements:', error);
    }
  }

  async getLeaderboard(limit = 10) {
    try {
      const leaderboard = await User.find({ role: 'student' })
        .select('username totalScore completedChallenges')
        .sort({ totalScore: -1 })
        .limit(limit);

      return leaderboard;
    } catch (error) {
      logger.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

module.exports = new ProgressService();
