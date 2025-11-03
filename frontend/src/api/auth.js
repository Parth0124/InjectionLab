import client from './client'

export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  getProfile: () => client.get('/auth/profile'),
  createPrivilegedUser: (data) => client.post('/auth/create-privileged-user', data),
}

// Named exports for direct imports
export const register = authAPI.register;
export const login = authAPI.login;
export const getProfile = authAPI.getProfile;
export const createPrivilegedUser = authAPI.createPrivilegedUser;