import client from './client'

export const usersAPI = {
  updateProfile: (data) => client.put('/users/profile', data),
  changePassword: (data) => client.put('/users/change-password', data),
  getProgress: () => client.get('/users/progress'),
  getStats: () => client.get('/users/stats'),
  getLeaderboard: (params) => client.get('/users/leaderboard', { params }),
  deleteAccount: () => client.delete('/users/account'),
}

// Named exports for direct imports - with more descriptive names
export const updateProfile = usersAPI.updateProfile;
export const changePassword = usersAPI.changePassword;
export const getUserProgress = usersAPI.getProgress; 
export const getUserStats = usersAPI.getStats;
export const getLeaderboard = usersAPI.getLeaderboard;
export const deleteUserAccount = usersAPI.deleteAccount;