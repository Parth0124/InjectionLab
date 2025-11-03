import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex">
        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage