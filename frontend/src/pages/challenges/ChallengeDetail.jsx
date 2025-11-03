import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChallengeById } from '../../api/challenges'
import { startSession } from '../../api/sqlInjection'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { 
  AcademicCapIcon, 
  ClockIcon,  
  LightBulbIcon,
  PlayIcon,
  ChevronLeftIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    fetchChallenge()
  }, [id])

  const fetchChallenge = async () => {
    setIsLoading(true)
    try {
      const response = await getChallengeById(id)
      if (response.success) {
        setChallenge(response.challenge)
      } else {
        toast.error('Challenge not found')
        navigate('/challenges')
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      toast.error('Error loading challenge')
      navigate('/challenges')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartPractice = async () => {
    setIsStarting(true)
    try {
      const response = await startSession(id)
      if (response.success) {
        toast.success('Practice session started!')
        navigate(`/practice/${response.sessionId}`)
      } else {
        toast.error(response.message || 'Failed to start practice session')
      }
    } catch (error) {
      console.error('Error starting practice:', error)
      toast.error('Error starting practice session')
    } finally {
      setIsStarting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!challenge) {
    return null
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Challenges
        </button>

        {/* Challenge Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {challenge.title}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[challenge.difficulty]}`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Level {challenge.level}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {challenge.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {challenge.points}
              </div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {challenge.description}
          </p>

          <button
            onClick={handleStartPractice}
            disabled={isStarting}
            className="btn-primary flex items-center justify-center w-full md:w-auto"
          >
            {isStarting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Starting...</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Practice
              </>
            )}
          </button>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {challenge.completionRate?.successRate ? 
                    `${challenge.completionRate.successRate.toFixed(1)}%` : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attempts</p>
                <p className="text-xl font-bold text-gray-900">
                  {challenge.completionRate?.attempts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Time</p>
                <p className="text-xl font-bold text-gray-900">
                  {challenge.completionRate?.averageTime ? 
                    `${challenge.completionRate.averageTime.toFixed(0)} min` : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        {challenge.educationalContent && (
          <div className="space-y-6">
            {/* Theory */}
            {challenge.educationalContent.theory && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-primary-600" />
                  Theory
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {challenge.educationalContent.theory}
                </p>
              </div>
            )}

            {/* Examples */}
            {challenge.educationalContent.examples && challenge.educationalContent.examples.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-600" />
                  Examples
                </h2>
                <div className="space-y-2">
                  {challenge.educationalContent.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3 font-mono text-sm">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prevention */}
            {challenge.educationalContent.prevention && (
              <div className="card bg-green-50 border-green-200">
                <h2 className="text-xl font-semibold mb-4 text-green-900">
                  Prevention Techniques
                </h2>
                <p className="text-green-800 leading-relaxed">
                  {challenge.educationalContent.prevention}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hints Preview */}
        {challenge.hints && challenge.hints.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Available Hints</h2>
            <p className="text-gray-600 mb-4">
              This challenge has {challenge.hints.length} hint{challenge.hints.length !== 1 ? 's' : ''} available during practice.
              Each hint will deduct points from your final score.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> Try to solve the challenge without hints to earn maximum points!
              </p>
            </div>
          </div>
        )}

        {/* Start Practice CTA */}
        <div className="card mt-6 bg-primary-50 border-primary-200">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start?
            </h3>
            <p className="text-gray-700 mb-6">
              Practice SQL injection techniques in a safe, isolated environment.
              All your progress will be saved automatically.
            </p>
            <button
              onClick={handleStartPractice}
              disabled={isStarting}
              className="btn-primary text-lg px-8 py-3"
            >
              {isStarting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Starting Practice...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-6 w-6 mr-2 inline" />
                  Start Practice Session
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeDetail