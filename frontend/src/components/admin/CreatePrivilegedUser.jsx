import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPrivilegedUser } from '../../api/auth';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';
import { XMarkIcon } from '@heroicons/react/24/outline';

function CreatePrivilegedUser({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      role: 'instructor'
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await createPrivilegedUser(data);
      toast.success(response.message || 'User created successfully');
      reset();
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Create Instructor/Admin Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded-lg p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Account Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-all duration-200 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-900/20">
                <input
                  {...register('role', { required: 'Role is required' })}
                  type="radio"
                  value="instructor"
                  className="mr-3 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm font-semibold text-white">Instructor</span>
              </label>
              <label className="flex items-center px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-all duration-200 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-900/20">
                <input
                  {...register('role', { required: 'Role is required' })}
                  type="radio"
                  value="admin"
                  className="mr-3 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-white">Admin</span>
              </label>
            </div>
            {errors.role && (
              <p className="mt-2 text-sm text-red-400">{errors.role.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
              Username *
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
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              placeholder="prof_smith"
            />
            {errors.username && (
              <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
              Email Address *
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
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              placeholder="prof.smith@university.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password *
            </label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number'
                }
              })}
              type="password"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-300 mb-2">
                First Name
              </label>
              <input
                {...register('profile.firstName')}
                type="text"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-300 mb-2">
                Last Name
              </label>
              <input
                {...register('profile.lastName')}
                type="text"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border border-gray-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? <><LoadingSpinner size="sm" /><span className="ml-2">Creating...</span></> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePrivilegedUser;