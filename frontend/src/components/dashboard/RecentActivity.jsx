import React from 'react'
import { formatRelativeTime } from '../../utils/helpers'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'

function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent activity to show.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-gray-900">
              {activity.challengeTitle}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <ClockIcon className="h-3 w-3 mr-1" />
              {formatRelativeTime(activity.completedAt)}
              <span className="ml-2">
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