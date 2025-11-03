import React from 'react'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { DIFFICULTY_LEVELS, CHALLENGE_CATEGORIES } from '../../utils/constants'

function ChallengeCard({ challenge, onClick }) {
  const isCompleted = challenge.userProgress === 'completed'

  return (
    <div 
      onClick={() => onClick(challenge)}
      className="card hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {challenge.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {challenge.description}
          </p>
        </div>
        {isCompleted && (
          <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
          Level {challenge.level}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${DIFFICULTY_LEVELS[challenge.difficulty].color}`}>
          {DIFFICULTY_LEVELS[challenge.difficulty].label}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {CHALLENGE_CATEGORIES[challenge.category]}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {challenge.points} Points
        </span>
        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}

export default ChallengeCard