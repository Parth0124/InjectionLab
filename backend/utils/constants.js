module.exports = {
  USER_ROLES: {
    STUDENT: 'student',
    INSTRUCTOR: 'instructor',
    ADMIN: 'admin'
  },

  CHALLENGE_CATEGORIES: {
    BASIC_BYPASS: 'basic-bypass',
    INFORMATION_DISCLOSURE: 'information-disclosure',
    UNION_BASED: 'union-based',
    BOOLEAN_BLIND: 'boolean-blind',
    TIME_BASED: 'time-based'
  },

  DIFFICULTY_LEVELS: {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  },

  PROGRESS_STATUS: {
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    FAILED: 'failed'
  },

  ACHIEVEMENT_CATEGORIES: {
    COMPLETION: 'completion',
    STREAK: 'streak',
    SPEED: 'speed',
    TECHNIQUE: 'technique',
    SPECIAL: 'special'
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  }
};
