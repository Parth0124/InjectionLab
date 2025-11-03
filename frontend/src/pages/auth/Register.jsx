import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../../store/authStore'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { validatePassword, getPasswordStrength } from '../../utils/validators'

function Register() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  
  const password = watch('password')
  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data) => {
    setError('')
    const result = await registerUser(data)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register('username', { 
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  },
                  maxLength: {
                    value: 30,
                    message: 'Username cannot exceed 30 characters'
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores'
                  }
                })}
                type="text"
                className="mt-1 input-field"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="mt-1 input-field"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  validate: value => validatePassword(value) || 'Password must contain uppercase, lowercase, and number'
                })}
                type="password"
                className="mt-1 input-field"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-full rounded ${
                          i < passwordStrength.strength
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name (Optional)
                </label>
                <input
                  {...register('profile.firstName')}
                  type="text"
                  className="mt-1 input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name (Optional)
                </label>
                <input
                  {...register('profile.lastName')}
                  type="text"
                  className="mt-1 input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution (Optional)
              </label>
              <input
                {...register('profile.institution')}
                type="text"
                className="mt-1 input-field"
                placeholder="University Name"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <select
                {...register('profile.level')}
                className="mt-1 input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register