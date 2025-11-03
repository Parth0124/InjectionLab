export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  // At least 6 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  return re.test(password)
}

export const validateUsername = (username) => {
  // 3-30 characters, alphanumeric and underscore only
  const re = /^[a-zA-Z0-9_]{3,30}$/
  return re.test(username)
}

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'Empty' }
  
  let strength = 0
  if (password.length >= 8) strength++
  if (password.match(/[a-z]+/)) strength++
  if (password.match(/[A-Z]+/)) strength++
  if (password.match(/[0-9]+/)) strength++
  if (password.match(/[$@#&!]+/)) strength++
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return { strength, label: labels[strength] }
}