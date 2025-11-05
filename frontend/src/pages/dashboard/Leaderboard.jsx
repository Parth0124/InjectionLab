import React, { useEffect, useState } from 'react'
import { TrophyIcon, UserIcon, FireIcon } from '@heroicons/react/24/solid'
import { usersAPI } from '../../api/users'
import useAuthStore from '../../store/authStore'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

function Leaderboard() {
  const { user: currentUser } = useAuthStore()
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRank, setUserRank] = useState(null)
  const [userStats, setUserStats] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await usersAPI.getLeaderboard({ limit: 100 })
      
      // The response IS the data object (axios interceptor already extracts response.data)
      if (response && response.success && response.leaderboard) {
        const leaderboardData = response.leaderboard
        setLeaderboard(leaderboardData)
        
        // Find current user in leaderboard
        if (currentUser) {
          const userEntry = leaderboardData.find(
            entry => entry.username === currentUser.username
          )
          
          if (userEntry) {
            setUserRank(userEntry.rank)
            setUserStats({
              username: userEntry.username,
              totalScore: userEntry.totalScore,
              completedChallenges: userEntry.completedChallenges,
              highestLevel: userEntry.highestLevel
            })
          }
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch leaderboard data')
      }
    } catch (err) {
      console.error('Leaderboard error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  const getPodiumColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-500 text-gray-900 shadow-xl shadow-yellow-500/50'
      case 2:
        return 'bg-gradient-to-br from-gray-400 via-gray-300 to-slate-400 text-gray-900 shadow-xl shadow-gray-400/50'
      case 3:
        return 'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl shadow-orange-500/50'
      default:
        return 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
    }
  }

  const getTrophyIcon = (rank) => {
    const size = rank === 1 ? 'h-16 w-16' : 'h-12 w-12'
    const color = rank === 1 
      ? 'text-yellow-200' 
      : rank === 2 
      ? 'text-gray-100' 
      : 'text-orange-200'
    
    return <TrophyIcon className={`${size} ${color} mb-2 drop-shadow-lg`} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    )
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center">
            <TrophyIcon className="h-12 w-12 text-yellow-500 mr-3 drop-shadow-lg" />
            Leaderboard
          </h1>
          <p className="text-xl text-gray-400">Top performers in SQL injection challenges</p>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="md:mt-8">
                <div className={`${getPodiumColor(2)} rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2`}>
                  {getTrophyIcon(2)}
                  <div className="text-3xl font-bold mb-1">2</div>
                  <div className="text-lg font-semibold mb-3">{topThree[1].username}</div>
                  <div className="flex justify-center items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <FireIcon className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{topThree[1].totalScore || 0} pts</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{topThree[1].completedChallenges || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div>
                <div className={`${getPodiumColor(1)} rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2`}>
                  {getTrophyIcon(1)}
                  <div className="text-4xl font-bold mb-2">1</div>
                  <div className="text-2xl font-bold mb-4">{topThree[0].username}</div>
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex items-center">
                      <FireIcon className="h-6 w-6 mr-1" />
                      <span className="text-lg font-bold">{topThree[0].totalScore || 0} pts</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-6 w-6 mr-1" />
                      <span className="text-lg font-bold">{topThree[0].completedChallenges || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="md:mt-8">
                <div className={`${getPodiumColor(3)} rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2`}>
                  {getTrophyIcon(3)}
                  <div className="text-3xl font-bold mb-1">3</div>
                  <div className="text-lg font-semibold mb-3">{topThree[2].username}</div>
                  <div className="flex justify-center items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <FireIcon className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{topThree[2].totalScore || 0} pts</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-1" />
                      <span className="font-semibold">{topThree[2].completedChallenges || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of Leaderboard */}
        {restOfLeaderboard.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Rankings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Challenges
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {restOfLeaderboard.map((entry) => (
                    <tr 
                      key={entry.rank}
                      className={
                        currentUser && entry.username === currentUser.username
                          ? 'bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-l-4 border-cyan-500'
                          : 'hover:bg-gray-800/50 transition-colors duration-200'
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                        #{entry.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-white">
                            {entry.username}
                            {currentUser && entry.username === currentUser.username && (
                              <span className="ml-2 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-2 py-1 rounded-full font-semibold">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-semibold text-white">
                          <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
                          {entry.totalScore || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                        {entry.completedChallenges || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          entry.highestLevel >= 3 
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30'
                            : entry.highestLevel === 2
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                        }`}>
                          Level {entry.highestLevel || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Your Statistics */}
        {currentUser && (
          <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-5 border border-cyan-700/50 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1">
                <div className="text-sm text-cyan-400 font-semibold mb-2">Your Rank</div>
                <div className="text-3xl font-bold text-white">
                  {userRank ? `#${userRank}` : 'N/A'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-5 border border-purple-700/50 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1">
                <div className="text-sm text-purple-400 font-semibold mb-2">Total Score</div>
                <div className="text-3xl font-bold text-white">
                  {userStats ? userStats.totalScore : currentUser.totalScore || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-xl p-5 border border-pink-700/50 hover:border-pink-500 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 transform hover:-translate-y-1">
                <div className="text-sm text-pink-400 font-semibold mb-2">Challenges</div>
                <div className="text-3xl font-bold text-white">
                  {userStats ? userStats.completedChallenges : currentUser.completedChallenges?.length || 0}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-5 border border-orange-700/50 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1">
                <div className="text-sm text-orange-400 font-semibold mb-2">Highest Level</div>
                <div className="text-3xl font-bold text-white">
                  {userStats ? userStats.highestLevel : 0}
                </div>
              </div>
            </div>
            {!userRank && (
              <div className="mt-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-lg">
                <p className="text-sm">
                  <strong className="font-bold">Note:</strong> You're not currently ranked. Complete some challenges to appear on the leaderboard!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 text-center shadow-xl">
            <TrophyIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              No Rankings Yet
            </h3>
            <p className="text-gray-400 text-lg">
              Be the first to complete challenges and appear on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard