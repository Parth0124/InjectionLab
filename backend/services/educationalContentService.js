const Challenge = require('../models/Challenge');
const logger = require('../utils/logger');

class EducationalContentService {
  async getEducationalContent(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId)
        .select('educationalContent title description level category');

      if (!challenge) {
        throw new Error('Challenge not found');
      }

      return {
        title: challenge.title,
        description: challenge.description,
        level: challenge.level,
        category: challenge.category,
        content: challenge.educationalContent
      };

    } catch (error) {
      logger.error('Error getting educational content:', error);
      throw error;
    }
  }

  async getPreventionTechniques(category) {
    try {
      const techniques = {
        'basic-bypass': {
          title: 'Preventing Authentication Bypass',
          techniques: [
            'Use parameterized queries/prepared statements',
            'Implement proper input validation',
            'Use stored procedures with parameters',
            'Apply the principle of least privilege',
            'Implement account lockout mechanisms'
          ],
          examples: [
            {
              language: 'javascript',
              vulnerable: "query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`",
              secure: "query = 'SELECT * FROM users WHERE email = ? AND password = ?'; db.query(query, [email, hashedPassword])"
            }
          ]
        },
        'union-based': {
          title: 'Preventing UNION-based Attacks',
          techniques: [
            'Use parameterized queries exclusively',
            'Implement input validation and sanitization',
            'Use white-list validation for dynamic queries',
            'Limit database permissions',
            'Implement proper error handling'
          ],
          examples: [
            {
              language: 'javascript',
              vulnerable: "query = `SELECT name, email FROM users WHERE id = ${userId} ORDER BY ${sortBy}`",
              secure: "const allowedSortBy = ['name', 'email', 'created_at']; if (!allowedSortBy.includes(sortBy)) throw error; query = 'SELECT name, email FROM users WHERE id = ? ORDER BY ' + sortBy"
            }
          ]
        },
        'boolean-blind': {
          title: 'Preventing Boolean-based Blind Attacks',
          techniques: [
            'Use parameterized queries',
            'Implement consistent error handling',
            'Avoid information disclosure in responses',
            'Use rate limiting',
            'Implement monitoring and alerting'
          ]
        },
        'time-based': {
          title: 'Preventing Time-based Attacks',
          techniques: [
            'Use parameterized queries',
            'Implement query timeouts',
            'Monitor query execution times',
            'Use prepared statements',
            'Implement rate limiting and CAPTCHA'
          ]
        }
      };

      return techniques[category] || null;

    } catch (error) {
      logger.error('Error getting prevention techniques:', error);
      throw error;
    }
  }
}

module.exports = new EducationalContentService();