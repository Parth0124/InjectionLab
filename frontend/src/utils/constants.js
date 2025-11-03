export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const CHALLENGE_CATEGORIES = {
  'basic-bypass': 'Basic Bypass',
  'information-disclosure': 'Information Disclosure',
  'union-based': 'Union Based',
  'boolean-blind': 'Boolean Blind',
  'time-based': 'Time Based'
}

export const DIFFICULTY_LEVELS = {
  easy: { label: 'Easy', color: 'text-green-600 bg-green-100' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  hard: { label: 'Hard', color: 'text-red-600 bg-red-100' }
}

export const USER_ROLES = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Admin'
}

export const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Master'
}