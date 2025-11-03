import { create } from 'zustand'
import { challengesAPI } from '../api/challenges'
import toast from 'react-hot-toast'

const useChallengeStore = create((set) => ({
  challenges: [],
  currentChallenge: null,
  isLoading: false,
  filters: {
    level: null,
    category: null,
    difficulty: null,
  },

  fetchChallenges: async (filters = {}) => {
    set({ isLoading: true })
    try {
      const response = await challengesAPI.getAll(filters)
      set({ challenges: response.challenges, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to load challenges')
      return { success: false, error: error.message }
    }
  },

  fetchChallengeById: async (id) => {
    set({ isLoading: true })
    try {
      const response = await challengesAPI.getById(id)
      set({ currentChallenge: response.challenge, isLoading: false })
      return { success: true, challenge: response.challenge }
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to load challenge details')
      return { success: false, error: error.message }
    }
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearCurrentChallenge: () => {
    set({ currentChallenge: null })
  },
}))

export default useChallengeStore