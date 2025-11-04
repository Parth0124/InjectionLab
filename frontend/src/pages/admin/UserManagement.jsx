import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserStatus, deleteUser } from '../../api/admin';
import UserTable from '../../components/admin/UserTable';
import CreatePrivilegedUser from '../../components/admin/CreatePrivilegedUser';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers(filters);
      setUsers(response.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      await updateUserStatus(userId, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateSuccess = () => {
    fetchUsers();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Instructor/Admin</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="input-field flex-1 min-w-[200px]"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
            className="input-field"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => setFilters({ page: 1, limit: 10, search: '', role: '', status: '' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <UserTable
          users={users}
          onUpdateStatus={handleUpdateUserStatus}
          onUpdateRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
        />
      )}

      {/* Create Privileged User Modal */}
      <CreatePrivilegedUser
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default UserManagement;