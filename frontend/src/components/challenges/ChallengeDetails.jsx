import React from 'react'
import { DIFFICULTY_LEVELS, CHALLENGE_CATEGORIES } from '../../utils/constants'

function ChallengeDetails({ challenge }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
        <p className="text-gray-600 mt-2">{challenge.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
          Level {challenge.level}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${DIFFICULTY_LEVELS[challenge.difficulty].color}`}>
          {DIFFICULTY_LEVELS[challenge.difficulty].label}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
          {CHALLENGE_CATEGORIES[challenge.category]}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          {challenge.points} Points
        </span>
      </div>

      {challenge.educationalContent && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Educational Content</h3>
          {challenge.educationalContent.theory && (
            <p className="text-blue-800 text-sm">{challenge.educationalContent.theory}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ChallengeDetails