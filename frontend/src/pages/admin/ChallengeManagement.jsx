import React, { useEffect, useState } from 'react'
import { getAllChallenges, createChallenge  } from '../../api/challenges'
import { deleteChallenge, updateChallenge } from '../../api/admin'
import ChallengeManager from '../../components/admin/ChallengeManager'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Challenge Management</h1>
          <p className="mt-2 text-gray-600">
            Create, edit, and manage SQL injection challenges
          </p>
        </div>

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