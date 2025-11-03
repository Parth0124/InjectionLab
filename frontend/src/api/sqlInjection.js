import client from './client'

export const sqlInjectionAPI = {
  startSession: (challengeId) => 
    client.post('/sql-injection/session/start', { challengeId }),
  executeQuery: (sessionId, query) => 
    client.post('/sql-injection/execute', { sessionId, query }),
  getHint: (challengeId, hintIndex) => 
    client.post('/sql-injection/hint', { challengeId, hintIndex }),
  endSession: (sessionId) => 
    client.post('/sql-injection/session/end', { sessionId }),
  getSessionInfo: (sessionId) => 
    client.get(`/sql-injection/session/${sessionId}`),
}

// Named exports for direct imports
export const startSession = sqlInjectionAPI.startSession;
export const executeQuery = sqlInjectionAPI.executeQuery;
export const getHint = sqlInjectionAPI.getHint;
export const endSession = sqlInjectionAPI.endSession;
export const getSessionInfo = sqlInjectionAPI.getSessionInfo;