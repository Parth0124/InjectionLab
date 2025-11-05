import React, { useEffect, useState } from 'react'
import { getAllChallenges, createChallenge  } from '../../api/challenges'
import { deleteChallenge, updateChallenge } from '../../api/admin'
import ChallengeManager from '../../components/admin/ChallengeManager'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

function ChallengeManagement() {
  const [challenges, setChallenges] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    setIsLoading(true)
    try {
      const response = await getAllChallenges()
      if (response.success) {
        setChallenges(response.challenges || [])
      } else {
        toast.error('Failed to load challenges')
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast.error('Error loading challenges')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChallenge = async (challengeData) => {
    try {
      const response = await createChallenge(challengeData)
      if (response.success) {
        toast.success('Challenge created successfully')
        fetchChallenges()
        return { success: true }
      } else {
        toast.error(response.message || 'Failed to create challenge')
        return { success: false }
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
      toast.error('Error creating challenge')
      return { success: false }
    }
  }

  const handleUpdateChallenge = async (challengeId, challengeData) => {
    try {
      const response = await updateChallenge(challengeId, challengeData)
      if (response.success) {
        toast.success('Challenge updated successfully')
        fetchChallenges()
        return { success: true }
      } else {
        toast.error(response.message || 'Failed to update challenge')
        return { success: false }
      }
    } catch (error) {
      console.error('Error updating challenge:', error)
      toast.error('Error updating challenge')
      return { success: false }
    }
  }

  const handleDeleteChallenge = async (challengeId) => {
    try {
      const response = await deleteChallenge(challengeId)
      if (response.success) {
        toast.success('Challenge deleted successfully')
        fetchChallenges()
        return { success: true }
      } else {
        toast.error(response.message || 'Failed to delete challenge')
        return { success: false }
      }
    } catch (error) {
      console.error('Error deleting challenge:', error)
      toast.error('Error deleting challenge')
      return { success: false }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <AcademicCapIcon className="h-10 w-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Challenge Management
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-400">
            Create, edit, and manage SQL injection challenges
          </p>
        </div>

        {/* Challenge Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Total</p>
                <p className="text-3xl font-bold text-white">{challenges.length}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <AcademicCapIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Easy</p>
                <p className="text-3xl font-bold text-green-400">
                  {challenges.filter(c => c.difficulty === 'easy').length}
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Medium</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {challenges.filter(c => c.difficulty === 'medium').length}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Hard+</p>
                <p className="text-3xl font-bold text-red-400">
                  {challenges.filter(c => c.difficulty === 'hard' || c.difficulty === 'expert').length}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-rose-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Manager */}
        <ChallengeManager
          challenges={challenges}
          isLoading={isLoading}
          onCreateChallenge={handleCreateChallenge}
          onUpdateChallenge={handleUpdateChallenge}
          onDeleteChallenge={handleDeleteChallenge}
        />
      </div>
    </div>
  )
}

export default ChallengeManagement