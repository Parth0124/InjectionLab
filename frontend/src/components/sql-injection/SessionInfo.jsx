import React, { useEffect, useState } from 'react'
import { ClockIcon, ChartBarIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import { formatRelativeTime } from '../../utils/helpers'

function SessionInfo({ sessionId, challenge }) {
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [sessionStartTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((new Date() - sessionStartTime) / 1000)
      const remaining = Math.max(1800 - elapsed, 0)
      setTimeRemaining(remaining)
      
      if (remaining === 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionStartTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white">Session Info</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-center text-gray-400">
            <ClockIcon className="h-5 w-5 mr-2 text-cyan-400" />
            <span className="text-sm font-semibold">Time Remaining</span>
          </div>
          <span className={`text-sm font-bold ${
            timeRemaining < 300 ? 'text-red-400' : 'text-cyan-400'
          }`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-center text-gray-400">
            <CircleStackIcon className="h-5 w-5 mr-2 text-purple-400" />
            <span className="text-sm font-semibold">Session ID</span>
          </div>
          <span className="text-xs font-mono text-purple-400 font-bold" title={sessionId}>
            {sessionId?.substring(0, 8)}...
          </span>
        </div>

        {challenge && (
          <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center text-gray-400">
              <ChartBarIcon className="h-5 w-5 mr-2 text-pink-400" />
              <span className="text-sm font-semibold">Points</span>
            </div>
            <span className="text-sm font-bold text-pink-400">
              {challenge.points}
            </span>
          </div>
        )}
      </div>

      {timeRemaining < 300 && timeRemaining > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-lg text-xs text-red-300 border border-red-700/50 font-semibold">
          ⚠️ Session expires in less than 5 minutes!
        </div>
      )}

      {timeRemaining === 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-red-900/50 to-rose-900/50 rounded-lg text-xs text-red-300 border border-red-700/50 font-semibold">
          ⏰ Session has expired. Please start a new session.
        </div>
      )}
    </div>
  )
}

export default SessionInfo