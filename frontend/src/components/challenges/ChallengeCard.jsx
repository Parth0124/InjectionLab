import React from 'react'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { DIFFICULTY_LEVELS, CHALLENGE_CATEGORIES } from '../../utils/constants'

function ChallengeCard({ challenge, onClick }) {
  const isCompleted = challenge.userProgress === 'completed'

  const getDifficultyStyle = (difficulty) => {
    switch(difficulty) {
      case 'easy':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
      case 'hard':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
      case 'expert':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30'
    }
  }

  return (
    <div 
      onClick={() => onClick(challenge)}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 relative overflow-hidden group"
    >
      {/* Completed Badge Overlay */}
      {isCompleted && (
        <div className="absolute top-0 right-0 w-24 h-24">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold py-1 right-[-35px] top-[20px] w-[120px] text-center shadow-lg">
            Completed
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200">
            {challenge.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>
        </div>
        {isCompleted && (
          <CheckCircleIcon className="h-7 w-7 text-green-400 flex-shrink-0 ml-3 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-lg shadow-cyan-500/30">
          Level {challenge.level}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyStyle(challenge.difficulty)}`}>
          {DIFFICULTY_LEVELS[challenge.difficulty]?.label || challenge.difficulty}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-xs font-bold shadow-lg shadow-purple-500/30">
          {CHALLENGE_CATEGORIES[challenge.category] || challenge.category}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-white">
            {challenge.points}
          </span>
          <span className="text-sm text-gray-400">Points</span>
        </div>
        <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">
          <span className="text-sm font-semibold mr-1">Start</span>
          <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  )
}

export default ChallengeCard