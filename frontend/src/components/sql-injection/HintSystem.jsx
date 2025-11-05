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
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-white">Hints</h3>
        <p className="text-gray-400 text-sm">No hints available for this challenge.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Hints</h3>
        <LightBulbIcon className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
      </div>

      <div className="space-y-3">
        {hints.map((hint, index) => {
          const isUnlocked = usedHints.includes(index)
          const isExpanded = expandedHints.includes(index)

          return (
            <div
              key={index}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                isUnlocked 
                  ? 'border-yellow-600/50 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
              }`}
              onClick={() => handleGetHint(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isUnlocked ? (
                    <LockOpenIcon className="h-5 w-5 text-yellow-400 mr-2 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" />
                  ) : (
                    <LockClosedIcon className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <span className={`text-sm font-semibold ${isUnlocked ? 'text-yellow-400' : 'text-gray-300'}`}>
                    Hint {hint.order || index + 1}
                  </span>
                </div>
                <span className="text-xs font-semibold text-red-400">
                  -{hint.pointDeduction} pts
                </span>
              </div>

              {isUnlocked && isExpanded && (
                <div className="mt-3 pt-3 border-t border-yellow-700/30 text-sm text-yellow-100 leading-relaxed">
                  {hint.text}
                </div>
              )}

              {!isUnlocked && (
                <p className="text-xs text-gray-500 mt-2">
                  Click to unlock this hint
                </p>
              )}

              {isUnlocked && !isExpanded && (
                <p className="text-xs text-yellow-600 mt-2">
                  Click to expand
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Hints used:</span>
          <span className="font-bold text-cyan-400">{usedHints.length}/{hints.length}</span>
        </div>
      </div>
    </div>
  )
}

export default HintSystem