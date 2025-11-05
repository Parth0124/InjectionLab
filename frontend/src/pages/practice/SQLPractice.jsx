import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  getSessionInfo, 
  executeQuery, 
  getHint, 
  endSession 
} from '../../api/sqlInjection'
import { getChallengeById } from '../../api/challenges'
import SQLEditor from '../../components/sql-injection/SQLEditor'
import QueryResults from '../../components/sql-injection/QueryResults'
import HintSystem from '../../components/sql-injection/HintSystem'
import SessionInfo from '../../components/sql-injection/SessionInfo'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { 
  ChevronLeftIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

function SQLPractice() {
  const { challengeId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [currentResult, setCurrentResult] = useState(null)
  const [queryHistory, setQueryHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [usedHints, setUsedHints] = useState([])
  const [showEndModal, setShowEndModal] = useState(false)

  useEffect(() => {
    if (challengeId) {
      loadSession()
    }
  }, [challengeId])

  const loadSession = async () => {
  console.log('Loading session:', challengeId) // Debug log
  setIsLoading(true)
  try {
    console.log('Fetching session info...') // Debug log
    const response = await getSessionInfo(challengeId)
    console.log('Session response:', response) // Debug log
    
    if (response.success) {
      setSession(response.session)
      setQueryHistory(response.session.queryHistory || [])
      setUsedHints(response.session.hintsUsed || [])
      
      console.log('Fetching challenge...') // Debug log
      // Load challenge details
      const challengeResponse = await getChallengeById(response.session.challengeId)
      console.log('Challenge response:', challengeResponse) // Debug log
      
      if (challengeResponse.success) {
        setChallenge(challengeResponse.challenge)
      }
    } else {
      console.log('Session not found:', response) // Debug log
      toast.error('Session not found')
      navigate('/challenges')
    }
  } catch (error) {
    console.error('Error loading session:', error)
    toast.error('Error loading practice session')
    navigate('/challenges')
  } finally {
    console.log('Setting isLoading to false') // Debug log
    setIsLoading(false)
  }
}

  useEffect(() => {
    console.log('SQLPractice mounted with challengeId:', challengeId)
    if (challengeId) {
      loadSession()
    } else {
      console.error('No challengeId found!')
    }
  }, [challengeId])

  const handleExecuteQuery = async (query) => {
    if (!query.trim()) {
      toast.error('Please enter a query')
      return
    }

    setIsExecuting(true)
    try {
      const response = await executeQuery(challengeId, query)
      if (response.success) {
        setCurrentResult(response.result)
        setQueryHistory(prev => [...prev, { 
          query, 
          result: response.result,
          timestamp: new Date()
        }])
        
        if (response.result.isInjectionSuccessful) {
          toast.success('🎉 SQL Injection Successful!')
          setTimeout(() => {
            setShowEndModal(true)
          }, 2000)
        } else if (response.result.success) {
          toast.success('Query executed successfully')
        } else {
          toast.error('Query failed')
        }
        
        // Refresh session info to get updated progress
        loadSession()
      } else {
        toast.error(response.message || 'Query execution failed')
      }
    } catch (error) {
      console.error('Error executing query:', error)
      toast.error('Error executing query')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleGetHint = async (hintIndex) => {
    try {
      const response = await getHint(challenge._id, hintIndex)
      if (response.success) {
        setUsedHints(prev => [...prev, hintIndex])
        toast.success('Hint unlocked!')
        loadSession()
        return { success: true }
      } else {
        toast.error(response.message || 'Failed to get hint')
        return { success: false }
      }
    } catch (error) {
      console.error('Error getting hint:', error)
      toast.error('Error getting hint')
      return { success: false }
    }
  }

  const handleEndSession = async () => {
    try {
      const response = await endSession(challengeId)
      if (response.success) {
        toast.success('Session ended successfully')
        navigate('/dashboard')
      } else {
        toast.error('Failed to end session')
      }
    } catch (error) {
      console.error('Error ending session:', error)
      toast.error('Error ending session')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || !challenge) {
    return null
  }

  const isCompleted = session.status === 'completed'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <button
              onClick={() => navigate('/challenges')}
              className="flex items-center text-gray-400 hover:text-cyan-400 mb-3 transition-colors duration-200 group"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Challenges
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {challenge.title}
            </h1>
            <p className="text-gray-400">{challenge.description}</p>
          </div>
          <button
            onClick={() => setShowEndModal(true)}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border border-gray-600 flex items-center ml-4 shadow-lg"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            End Session
          </button>
        </div>

        {/* Success Banner */}
        {isCompleted && (
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700/50 rounded-xl p-5 mb-6 shadow-lg shadow-green-500/20">
            <div className="flex items-center">
              <CheckCircleIcon className="h-7 w-7 text-green-400 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-green-300 font-bold text-lg">Challenge Completed!</h3>
                <p className="text-sm text-green-400">
                  You've successfully completed this challenge. Final score: <span className="font-bold">{session.score}</span> points
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info */}
            <SessionInfo session={session} challenge={challenge} />

            {/* SQL Editor */}
            <SQLEditor
              onExecute={handleExecuteQuery}
              isExecuting={isExecuting}
            />

            {/* Query Results */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">Results</h3>
              <QueryResults 
                result={currentResult} 
                history={queryHistory}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hints */}
            <HintSystem
              challengeId={challenge._id}
              hints={challenge.hints}
              usedHints={usedHints}
              onGetHint={handleGetHint}
            />

            {/* Educational Content */}
            {challenge.educationalContent && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <InformationCircleIcon className="h-6 w-6 mr-2 text-cyan-400" />
                  Learning Resources
                </h3>
                
                {challenge.educationalContent.theory && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">Theory</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {challenge.educationalContent.theory}
                    </p>
                  </div>
                )}

                {challenge.educationalContent.examples && 
                 challenge.educationalContent.examples.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-purple-400 mb-2">Examples</h4>
                    <div className="space-y-2">
                      {challenge.educationalContent.examples.map((example, index) => (
                        <div key={index} className="text-xs bg-gray-950 p-3 rounded-lg font-mono text-cyan-400 border border-gray-800">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {challenge.educationalContent.prevention && (
                  <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-400 mb-2 text-sm">
                      Prevention
                    </h4>
                    <p className="text-xs text-green-300 leading-relaxed">
                      {challenge.educationalContent.prevention}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-5 border border-yellow-700/50 shadow-xl">
              <h3 className="text-sm font-bold text-yellow-400 mb-3">
                💡 Tips
              </h3>
              <ul className="text-xs text-yellow-200 space-y-2">
                <li>• Try different SQL injection techniques</li>
                <li>• Pay attention to error messages</li>
                <li>• Use comments (--) to bypass parts of queries</li>
                <li>• Test with simple payloads first</li>
                <li>• Use hints wisely - they reduce your score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* End Session Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isCompleted ? 'Session Complete!' : 'End Practice Session?'}
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {isCompleted 
                ? 'Congratulations on completing this challenge! Your progress has been saved.'
                : 'Are you sure you want to end this practice session? Your progress will be saved.'}
            </p>
            <div className="space-y-3 bg-gray-950/50 rounded-lg p-4 border border-gray-700 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Score:</span>
                <span className="font-bold text-cyan-400">{session.score} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Attempts:</span>
                <span className="font-bold text-purple-400">{session.attempts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hints Used:</span>
                <span className="font-bold text-pink-400">{session.hintsUsed?.length || 0}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border border-gray-600 flex-1 shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEndSession}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex-1"
              >
                {isCompleted ? 'Return to Dashboard' : 'End Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SQLPractice