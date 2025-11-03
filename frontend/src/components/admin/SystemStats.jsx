import React from 'react'
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function SystemStats({ stats }) {
  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading system statistics...
      </div>
    )
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  // Prepare data for charts
  const usersByRoleData = stats.usersByRole ? Object.entries(stats.usersByRole).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count
  })) : []

  const challengesByDifficultyData = stats.challengesByDifficulty ? Object.entries(stats.challengesByDifficulty).map(([difficulty, count]) => ({
    name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    value: count
  })) : []

  const recentActivityData = stats.recentActivity || []

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers || 0}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {stats.activeUsers || 0} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Challenges</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalChallenges || 0}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {stats.activeChallenges || 0} active
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalSessions || 0}
              </p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {stats.activeSessions || 0} active
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.overallSuccessRate ? `${stats.overallSuccessRate.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {stats.totalCompletions || 0} completions
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Users by Role</h3>
          {usersByRoleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersByRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usersByRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No user data available</p>
          )}
        </div>

        {/* Challenges by Difficulty */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Challenges by Difficulty</h3>
          {challengesByDifficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={challengesByDifficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No challenge data available</p>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      {recentActivityData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#3b82f6" name="Sessions" />
              <Line type="monotone" dataKey="completions" stroke="#10b981" name="Completions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Top Challenge Category</h4>
          <p className="text-xl font-bold text-gray-900">
            {stats.topCategory || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.topCategoryCount || 0} attempts
          </p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average Session Duration</h4>
          <p className="text-xl font-bold text-gray-900">
            {stats.avgSessionDuration ? `${stats.avgSessionDuration.toFixed(1)} min` : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Per practice session
          </p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Total Hints Used</h4>
          <p className="text-xl font-bold text-gray-900">
            {stats.totalHintsUsed || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Across all sessions
          </p>
        </div>
      </div>

      {/* Most Active Users */}
      {stats.mostActiveUsers && stats.mostActiveUsers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Most Active Users (Last 7 Days)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.mostActiveUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.sessionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.completionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Challenge Performance */}
      {stats.challengePerformance && stats.challengePerformance.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Challenge Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Challenge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.challengePerformance.map((challenge) => (
                  <tr key={challenge._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {challenge.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {challenge.attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {challenge.completions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        challenge.successRate >= 70 ? 'bg-green-100 text-green-800' :
                        challenge.successRate >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge.successRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {challenge.avgTime ? `${challenge.avgTime.toFixed(1)} min` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemStats