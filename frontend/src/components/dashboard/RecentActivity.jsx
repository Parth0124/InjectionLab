import React from 'react'
import { formatRelativeTime } from '../../utils/helpers'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No recent activity to show.
      </div>
    )
  }
   if (activities) {
    console.log(activities)
   }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all">
          <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-white">
              {activity.challengeTitle}
            </p>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <ClockIcon className="h-3 w-3 mr-1" />
              {formatRelativeTime(activity.completedAt)}
              <span className="ml-2 text-cyan-400 font-semibold">
                Score: {activity.score}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity