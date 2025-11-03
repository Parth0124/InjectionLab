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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Create Instructor/Admin Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('role', { required: 'Role is required' })}
                  type="radio"
                  value="instructor"
                  className="mr-2"
                />
                <span className="text-sm">Instructor</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('role', { required: 'Role is required' })}
                  type="radio"
                  value="admin"
                  className="mr-2"
                />
                <span className="text-sm">Admin</span>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 input-field"
              placeholder="prof_smith"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 input-field"
              placeholder="prof.smith@university.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 input-field"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
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
                Last Name
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
              Institution
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

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePrivilegedUser;