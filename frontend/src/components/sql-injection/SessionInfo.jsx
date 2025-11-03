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
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Session Info</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Time Remaining</span>
          </div>
          <span className={`text-sm font-medium ${
            timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {formatTime(timeRemaining)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CircleStackIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">Session ID</span>
          </div>
          <span className="text-xs font-mono text-gray-900" title={sessionId}>
            {sessionId?.substring(0, 8)}...
          </span>
        </div>

        {challenge && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">Points</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {challenge.points}
            </span>
          </div>
        )}
      </div>

      {timeRemaining < 300 && timeRemaining > 0 && (
        <div className="mt-4 p-2 bg-red-50 rounded text-xs text-red-600">
          Session expires in less than 5 minutes!
        </div>
      )}

      {timeRemaining === 0 && (
        <div className="mt-4 p-2 bg-red-50 rounded text-xs text-red-600">
          Session has expired. Please start a new session.
        </div>
      )}
    </div>
  )
}

export default SessionInfo