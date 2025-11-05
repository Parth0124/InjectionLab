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
      <div className="text-center py-8 text-gray-400">
        Loading system statistics...
      </div>
    )
  }

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

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
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-cyan-500 hover:shadow-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalUsers || 0}
              </p>
              <p className="text-sm text-green-400 mt-2 flex items-center font-semibold">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {stats.activeUsers || 0} active
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/30">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400">Total Challenges</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalChallenges || 0}
              </p>
              <p className="text-sm text-green-400 mt-2 flex items-center font-semibold">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {stats.activeChallenges || 0} active
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/30">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-green-500 hover:shadow-green-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalSessions || 0}
              </p>
              <p className="text-sm text-blue-400 mt-2 flex items-center font-semibold">
                <ClockIcon className="h-4 w-4 mr-1" />
                {stats.activeSessions || 0} active
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-500/30">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-yellow-500 hover:shadow-yellow-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400">Success Rate</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.overallSuccessRate ? `${stats.overallSuccessRate.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {stats.totalCompletions || 0} completions
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg shadow-yellow-500/30">
              <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Users by Role</h3>
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
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-8">No user data available</p>
          )}
        </div>

        {/* Challenges by Difficulty */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Challenges by Difficulty</h3>
          {challengesByDifficultyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={challengesByDifficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-8">No challenge data available</p>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      {recentActivityData.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="sessions" stroke="#06b6d4" name="Sessions" strokeWidth={2} />
              <Line type="monotone" dataKey="completions" stroke="#10b981" name="Completions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-cyan-500 transition-all duration-300">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Top Challenge Category</h4>
          <p className="text-2xl font-bold text-cyan-400">
            {stats.topCategory || 'N/A'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {stats.topCategoryCount || 0} attempts
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-purple-500 transition-all duration-300">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Average Session Duration</h4>
          <p className="text-2xl font-bold text-purple-400">
            {stats.avgSessionDuration ? `${stats.avgSessionDuration.toFixed(1)} min` : 'N/A'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Per practice session
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:border-pink-500 transition-all duration-300">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Total Hints Used</h4>
          <p className="text-2xl font-bold text-pink-400">
            {stats.totalHintsUsed || 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Across all sessions
          </p>
        </div>
      </div>

      {/* Most Active Users */}
      {stats.mostActiveUsers && stats.mostActiveUsers.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white">Most Active Users (Last 7 Days)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Sessions</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Completions</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.mostActiveUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.sessionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.completionCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-bold">
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
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-6 text-white">Challenge Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Challenge</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Completions</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-cyan-400 uppercase">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.challengePerformance.map((challenge) => (
                  <tr key={challenge._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      {challenge.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {challenge.attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {challenge.completions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        challenge.successRate >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30' :
                        challenge.successRate >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30' :
                        'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30'
                      }`}>
                        {challenge.successRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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