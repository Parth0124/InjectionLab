import React, { useState } from 'react'
import { LightBulbIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import usePracticeStore from '../../store/practiceStore'
import toast from 'react-hot-toast'

function HintSystem({ challengeId, hints }) {
  const { usedHints, getHint } = usePracticeStore()
  const [expandedHints, setExpandedHints] = useState([])

  const handleGetHint = async (hintIndex) => {
    if (usedHints.includes(hintIndex)) {
      // Toggle visibility of already unlocked hint
      if (expandedHints.includes(hintIndex)) {
        setExpandedHints(expandedHints.filter(i => i !== hintIndex))
      } else {
        setExpandedHints([...expandedHints, hintIndex])
      }
    } else {
      // Unlock new hint
      const confirm = window.confirm(
        `This hint will cost ${hints[hintIndex].pointDeduction} points. Continue?`
      )
      if (confirm) {
        const result = await getHint(challengeId, hintIndex)
        if (result.success) {
          setExpandedHints([...expandedHints, hintIndex])
        }
      }
    }
  }

  if (!hints || hints.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hints</h3>
        <p className="text-gray-500 text-sm">No hints available for this challenge.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Hints</h3>
        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {hints.map((hint, index) => {
          const isUnlocked = usedHints.includes(index)
          const isExpanded = expandedHints.includes(index)

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                isUnlocked 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleGetHint(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isUnlocked ? (
                    <LockOpenIcon className="h-4 w-4 text-yellow-600 mr-2" />
                  ) : (
                    <LockClosedIcon className="h-4 w-4 text-gray-400 mr-2" />
                  )}
                  <span className="text-sm font-medium">
                    Hint {hint.order || index + 1}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  -{hint.pointDeduction} pts
                </span>
              </div>

              {isUnlocked && isExpanded && (
                <div className="mt-2 text-sm text-gray-700">
                  {hint.text}
                </div>
              )}

              {!isUnlocked && (
                <p className="text-xs text-gray-500 mt-1">
                  Click to unlock this hint
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Hints used: {usedHints.length}/{hints.length}
      </div>
    </div>
  )
}

export default HintSystem