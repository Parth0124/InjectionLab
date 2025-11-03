import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../../store/authStore'
import {updateProfile, changePassword } from '../../api/users'
import { getProfile } from '../../api/auth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'

function Profile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, setValue } = useForm()
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const response = await getProfile()
      if (response.success) {
        const userData = response.user
        setValue('username', userData.username)
        setValue('email', userData.email)
        setValue('profile.firstName', userData.profile?.firstName || '')
        setValue('profile.lastName', userData.profile?.lastName || '')
        setValue('profile.institution', userData.profile?.institution || '')
        setValue('profile.level', userData.profile?.level || 'beginner')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const onProfileSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await updateProfile(data)
      if (response.success) {
        toast.success('Profile updated successfully')
        updateUser(response.user)
      } else {
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })
      
      if (response.success) {
        toast.success('Password changed successfully')
        resetPassword()
      } else {
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Error changing password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and security settings
          </p>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserCircleIcon className="h-5 w-5 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LockClosedIcon className="h-5 w-5 inline mr-2" />
                Security
              </button>
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    {...registerProfile('username')}
                    type="text"
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...registerProfile('email')}
                    type="email"
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...registerProfile('profile.firstName')}
                    type="text"
                    className="input-field"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...registerProfile('profile.lastName')}
                    type="text"
                    className="input-field"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    {...registerProfile('profile.institution')}
                    type="text"
                    className="input-field"
                    placeholder="University Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    {...registerProfile('profile.level')}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required'
                    })}
                    type="password"
                    className="input-field"
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="input-field"
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your password'
                    })}
                    type="password"
                    className="input-field"
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* User Stats Card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Score</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {user?.totalScore || 0}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Challenges Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {user?.completedChallenges?.length || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Achievements</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {user?.achievements?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile