import { create } from 'zustand'
import { sqlInjectionAPI } from '../api/sqlInjection'
import toast from 'react-hot-toast'

const usePracticeStore = create((set, get) => ({
  sessionId: null,
  sessionInfo: null,
  queryHistory: [],
  currentResult: null,
  isLoading: false,
  hints: [],
  usedHints: [],

  startSession: async (challengeId) => {
    set({ isLoading: true })
    try {
      const response = await sqlInjectionAPI.startSession(challengeId)
      set({ 
        sessionId: response.sessionId,
        queryHistory: [],
        currentResult: null,
        hints: [],
        usedHints: [],
        isLoading: false 
      })
      toast.success('Practice session started!')
      return { success: true, sessionId: response.sessionId }
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to start session')
      return { success: false, error: error.message }
    }
  },

  executeQuery: async (query) => {
    const { sessionId } = get()
    if (!sessionId) {
      toast.error('No active session')
      return { success: false }
    }

    set({ isLoading: true })
    try {
      const response = await sqlInjectionAPI.executeQuery(sessionId, query)
      const newHistory = [...get().queryHistory, { query, result: response.result }]
      
      set({ 
        currentResult: response.result,
        queryHistory: newHistory,
        isLoading: false 
      })

      if (response.result.isInjectionSuccessful) {
        toast.success('SQL injection successful!')
      }

      return { success: true, result: response.result }
    } catch (error) {
      set({ isLoading: false })
      toast.error(error.message || 'Query execution failed')
      return { success: false, error: error.message }
    }
  },

  getHint: async (challengeId, hintIndex) => {
    set({ isLoading: true })
    try {
      const response = await sqlInjectionAPI.getHint(challengeId, hintIndex)
      const newUsedHints = [...get().usedHints, hintIndex]
      
      set({ 
        usedHints: newUsedHints,
        isLoading: false 
      })
      
      toast.info('Hint unlocked! Points deducted.')
      return { success: true, hint: response.hint }
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to get hint')
      return { success: false, error: error.message }
    }
  },

  endSession: async () => {
    const { sessionId } = get()
    if (!sessionId) return

    try {
      await sqlInjectionAPI.endSession(sessionId)
      set({ 
        sessionId: null,
        sessionInfo: null,
        queryHistory: [],
        currentResult: null,
        hints: [],
        usedHints: []
      })
      toast.success('Session ended')
      return { success: true }
    } catch (error) {
      toast.error('Failed to end session properly')
      return { success: false, error: error.message }
    }
  },

  getSessionInfo: async () => {
    const { sessionId } = get()
    if (!sessionId) return

    try {
      const response = await sqlInjectionAPI.getSessionInfo(sessionId)
      set({ sessionInfo: response })
      return { success: true, sessionInfo: response }
    } catch (error) {
      console.error('Failed to get session info:', error)
      return { success: false, error: error.message }
    }
  },

  clearSession: () => {
    set({
      sessionId: null,
      sessionInfo: null,
      queryHistory: [],
      currentResult: null,
      hints: [],
      usedHints: []
    })
  },
}))

export default usePracticeStore