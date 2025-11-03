import client from './client'

export const adminAPI = {
  // User management
  getUsers: (params) => client.get('/admin/users', { params }),
  updateUserStatus: (userId, data) => client.put(`/admin/users/${userId}/status`, data),
  updateUserRole: (userId, data) => client.put(`/admin/users/${userId}/role`, data),
  deleteUser: (userId) => client.delete(`/admin/users/${userId}`),
  getUserDetails: (userId) => client.get(`/admin/users/${userId}/details`),
  
  // Challenge management
  updateChallenge: (id, data) => client.put(`/admin/challenges/${id}`, data),
  deleteChallenge: (id) => client.delete(`/admin/challenges/${id}`),
  
  // System
  getSystemStats: () => client.get('/admin/stats'),
  cleanupSessions: () => client.post('/admin/cleanup-sessions'),
  getSystemLogs: (params) => client.get('/admin/logs', { params }),
  
  // Achievements
  createAchievement: (data) => client.post('/admin/achievements', data),
  getAchievements: () => client.get('/admin/achievements'),
  updateAchievement: (id, data) => client.put(`/admin/achievements/${id}`, data),
}

// Named exports for direct imports
export const getUsers = adminAPI.getUsers;
export const updateUserStatus = adminAPI.updateUserStatus;
export const updateUserRole = adminAPI.updateUserRole;
export const deleteUser = adminAPI.deleteUser;
export const getUserDetails = adminAPI.getUserDetails;
export const updateChallenge = adminAPI.updateChallenge;
export const deleteChallenge = adminAPI.deleteChallenge;
export const getSystemStats = adminAPI.getSystemStats;
export const cleanupSessions = adminAPI.cleanupSessions;
export const getSystemLogs = adminAPI.getSystemLogs;
export const createAchievement = adminAPI.createAchievement;
export const getAchievements = adminAPI.getAchievements;
export const updateAchievement = adminAPI.updateAchievement;