import { format, formatDistance, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'PPP')
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const setAuthToken = (token) => {
  localStorage.setItem('token', token)
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const calculateProgress = (completed, total) => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}