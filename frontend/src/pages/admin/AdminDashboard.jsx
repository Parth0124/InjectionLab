import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline'
import { adminAPI } from '../../api/admin'
import StatsCard from '../../components/dashboard/StatsCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Helper function to format relative time
function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return then.toLocaleDateString();
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      const response = await adminAPI.getSystemStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Failed to load system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={<UsersIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats?.users?.active || 0}
          icon={<UsersIcon className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Total Challenges"
          value={stats?.challenges?.total || 0}
          icon={<AcademicCapIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Active Sessions"
          value={stats?.sessions?.activeSessions || 0}
          icon={<CircleStackIcon className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
          <UsersIcon className="h-8 w-8 text-primary-600 mb-3" />
          <h2 className="text-lg font-semibold mb-2">User Management</h2>
          <p className="text-gray-600 text-sm">
            Manage user accounts, roles, and permissions
          </p>
        </Link>

        <Link to="/admin/challenges" className="card hover:shadow-lg transition-shadow">
          <AcademicCapIcon className="h-8 w-8 text-primary-600 mb-3" />
          <h2 className="text-lg font-semibold mb-2">Challenge Management</h2>
          <p className="text-gray-600 text-sm">
            Create, edit, and manage SQL injection challenges
          </p>
        </Link>

        <div className="card">
          <ChartBarIcon className="h-8 w-8 text-primary-600 mb-3" />
          <h2 className="text-lg font-semibold mb-2">System Analytics</h2>
          <p className="text-gray-600 text-sm mb-3">
            View detailed system statistics and reports
          </p>
          <button className="btn-primary text-sm">
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            {stats.recentActivity.newUsers?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">New Users</h3>
                <div className="space-y-1">
                  {stats.recentActivity.newUsers.map((user, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {user.username} joined {formatRelativeTime(user.createdAt)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard