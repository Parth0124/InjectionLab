import client from './client'

export const challengesAPI = {
  getAll: (params) => client.get('/challenges', { params }),
  getById: (id) => client.get(`/challenges/${id}`),
  create: (data) => client.post('/challenges', data),
}

// Named exports for direct imports
export const getAllChallenges = challengesAPI.getAll;
export const getChallengeById = challengesAPI.getById;
export const createChallenge = challengesAPI.create;