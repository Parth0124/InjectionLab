import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Manage users, challenges, and monitor system performance
          </p>
        </div>

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
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/admin/users" 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <UsersIcon className="h-10 w-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-xl font-bold text-white mb-2">User Management</h2>
            <p className="text-gray-400 text-sm">
              Manage user accounts, roles, and permissions
            </p>
          </Link>

          <Link 
            to="/admin/challenges" 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <AcademicCapIcon className="h-10 w-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-xl font-bold text-white mb-2">Challenge Management</h2>
            <p className="text-gray-400 text-sm">
              Create, edit, and manage SQL injection challenges
            </p>
          </Link>
        </div>

        {/* Recent Activity */}
        {stats?.recentActivity && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Recent System Activity</h2>
            <div className="space-y-4">
              {stats.recentActivity.newUsers?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wide">New Users</h3>
                  <div className="space-y-2">
                    {stats.recentActivity.newUsers.map((user, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="text-gray-300 font-medium">{user.username}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          joined {formatRelativeTime(user.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(!stats.recentActivity.newUsers || stats.recentActivity.newUsers.length === 0) && (
                <p className="text-gray-400 text-center py-4">No recent activity to display</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard