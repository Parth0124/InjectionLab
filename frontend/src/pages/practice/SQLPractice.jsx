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
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || !challenge) {
    return null
  }

  const isCompleted = session.status === 'completed'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <button
              onClick={() => navigate('/challenges')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-1" />
              Back to Challenges
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {challenge.title}
            </h1>
            <p className="text-gray-600">{challenge.description}</p>
          </div>
          <button
            onClick={() => setShowEndModal(true)}
            className="btn-secondary flex items-center ml-4"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            End Session
          </button>
        </div>

        {/* Success Banner */}
        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-green-900 font-semibold">Challenge Completed!</h3>
                <p className="text-sm text-green-700">
                  You've successfully completed this challenge. Final score: {session.score} points
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
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Results</h3>
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
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Learning Resources
                </h3>
                
                {challenge.educationalContent.theory && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Theory</h4>
                    <p className="text-sm text-gray-700">
                      {challenge.educationalContent.theory}
                    </p>
                  </div>
                )}

                {challenge.educationalContent.examples && 
                 challenge.educationalContent.examples.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Examples</h4>
                    <div className="space-y-1">
                      {challenge.educationalContent.examples.map((example, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded font-mono">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {challenge.educationalContent.prevention && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <h4 className="font-medium text-green-900 mb-2 text-sm">
                      Prevention
                    </h4>
                    <p className="text-xs text-green-800">
                      {challenge.educationalContent.prevention}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="card bg-yellow-50 border-yellow-200">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Tips
              </h3>
              <ul className="text-xs text-yellow-800 space-y-1">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {isCompleted ? 'Session Complete!' : 'End Practice Session?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isCompleted 
                ? 'Congratulations on completing this challenge! Your progress has been saved.'
                : 'Are you sure you want to end this practice session? Your progress will be saved.'}
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Score:</span>
                <span className="font-semibold">{session.score} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attempts:</span>
                <span className="font-semibold">{session.attempts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hints Used:</span>
                <span className="font-semibold">{session.hintsUsed?.length || 0}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEndModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleEndSession}
                className="btn-primary flex-1"
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