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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!challenge) {
    return null
  }

  const difficultyColors = {
    easy: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30',
    medium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30',
    hard: 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30',
    expert: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/challenges')}
          className="flex items-center text-gray-400 hover:text-cyan-400 mb-6 transition-colors duration-200 group"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Challenges
        </button>

        {/* Challenge Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-xl mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {challenge.title}
              </h1>
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${difficultyColors[challenge.difficulty]}`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-cyan-500/30">
                  Level {challenge.level}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg shadow-purple-500/30">
                  {challenge.category}
                </span>
              </div>
            </div>
            <div className="text-right ml-6">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {challenge.points}
              </div>
              <div className="text-sm text-gray-400 font-semibold">Points</div>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {challenge.description}
          </p>

          <button
            onClick={handleStartPractice}
            disabled={isStarting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-blue-500 hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-4 shadow-lg shadow-blue-500/30">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {challenge.completionRate?.successRate ? 
                    `${challenge.completionRate.successRate.toFixed(1)}%` : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-green-500 hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-4 shadow-lg shadow-green-500/30">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Attempts</p>
                <p className="text-2xl font-bold text-white">
                  {challenge.completionRate?.attempts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mr-4 shadow-lg shadow-purple-500/30">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Avg. Time</p>
                <p className="text-2xl font-bold text-white">
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
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3 shadow-lg shadow-cyan-500/30">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  Theory
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {challenge.educationalContent.theory}
                </p>
              </div>
            )}

            {/* Examples */}
            {challenge.educationalContent.examples && challenge.educationalContent.examples.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mr-3 shadow-lg shadow-yellow-500/30">
                    <LightBulbIcon className="h-6 w-6 text-white" />
                  </div>
                  Examples
                </h2>
                <div className="space-y-3">
                  {challenge.educationalContent.examples.map((example, index) => (
                    <div key={index} className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-cyan-400 border border-gray-800 shadow-inner">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prevention */}
            {challenge.educationalContent.prevention && (
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl p-6 border border-green-700/50 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-green-400">
                  Prevention Techniques
                </h2>
                <p className="text-green-200 leading-relaxed text-lg">
                  {challenge.educationalContent.prevention}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hints Preview */}
        {challenge.hints && challenge.hints.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl mt-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Available Hints</h2>
            <p className="text-gray-300 mb-4">
              This challenge has <span className="text-cyan-400 font-bold">{challenge.hints.length}</span> hint{challenge.hints.length !== 1 ? 's' : ''} available during practice.
              Each hint will deduct points from your final score.
            </p>
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-600/50 rounded-lg p-4">
              <p className="text-sm text-yellow-200">
                💡 <strong className="font-bold">Tip:</strong> Try to solve the challenge without hints to earn maximum points!
              </p>
            </div>
          </div>
        )}

        {/* Start Practice CTA */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 border border-cyan-700/50 shadow-xl mt-6 hover:border-cyan-500 transition-all duration-300">
          <div className="text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Ready to Start?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Practice SQL injection techniques in a safe, isolated environment.
              All your progress will be saved automatically.
            </p>
            <button
              onClick={handleStartPractice}
              disabled={isStarting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg px-10 py-4 rounded-lg font-bold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
            >
              {isStarting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Starting Practice...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-6 w-6 mr-2" />
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