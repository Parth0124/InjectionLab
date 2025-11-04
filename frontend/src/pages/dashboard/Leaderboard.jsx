import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/users";
import useAuthStore from "../../store/authStore";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { TrophyIcon, UserIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../utils/helpers";

function Leaderboard() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await getLeaderboard({ limit }); // Pass as object
      if (response.success) {
        setLeaderboard(response.leaderboard || []);
      } else {
        toast.error("Failed to load leaderboard");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Error loading leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-600";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-600";
    return "text-gray-600";
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <TrophyIcon className={`h-6 w-6 ${getRankColor(rank)}`} />;
    }
    return <span className="text-gray-600 font-semibold">{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-600 mr-3" />
            Leaderboard
          </h1>
          <p className="mt-2 text-gray-600">
            Top performers in SQL injection challenges
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 items-end">
              {/* 2nd Place */}
              <div className="card bg-gradient-to-br from-gray-100 to-gray-200 text-center pt-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-gray-600" />
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2">
                    <TrophyIcon className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">2nd</div>
                <div className="font-semibold text-gray-900 mb-1">
                  {leaderboard[1].username}
                </div>
                <div className="text-xl font-bold text-primary-600 mb-2">
                  {leaderboard[1].totalScore}
                </div>
                <div className="text-sm text-gray-600">
                  {leaderboard[1].completedChallenges?.length || 0} challenges
                </div>
              </div>

              {/* 1st Place */}
              <div className="card bg-gradient-to-br from-yellow-100 to-yellow-200 text-center pt-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-yellow-300 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-yellow-400">
                    <UserIcon className="h-12 w-12 text-yellow-700" />
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-3">
                    <TrophyIcon className="h-10 w-10 text-yellow-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-800 mb-1">
                  1st
                </div>
                <div className="font-semibold text-gray-900 mb-1 text-lg">
                  {leaderboard[0].username}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {leaderboard[0].totalScore}
                </div>
                <div className="text-sm text-gray-600">
                  {leaderboard[0].completedChallenges?.length || 0} challenges
                </div>
              </div>

              {/* 3rd Place */}
              <div className="card bg-gradient-to-br from-orange-100 to-orange-200 text-center pt-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-orange-700" />
                  </div>
                  <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2">
                    <TrophyIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-800 mb-1">
                  3rd
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {leaderboard[2].username}
                </div>
                <div className="text-xl font-bold text-primary-600 mb-2">
                  {leaderboard[2].totalScore}
                </div>
                <div className="text-sm text-gray-600">
                  {leaderboard[2].completedChallenges?.length || 0} challenges
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Full Rankings</h2>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="input-field w-auto"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>

          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No users on the leaderboard yet.</p>
              <p className="text-sm mt-2">
                Be the first to complete challenges and earn points!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentUser = entry._id === user?._id;

                    return (
                      <tr
                        key={entry._id}
                        className={isCurrentUser ? "bg-primary-50" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-10">
                            {getRankIcon(rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <UserIcon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.username}
                                {isCurrentUser && (
                                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              {entry.profile?.institution && (
                                <div className="text-xs text-gray-500">
                                  {entry.profile.institution}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-primary-600">
                            {entry.totalScore}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {entry.completedChallenges?.length || 0} challenges
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                            {entry.profile?.level || "beginner"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(entry.lastLogin || entry.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Current User Stats */}
        {user && (
          <div className="card mt-6 bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Your Rank</div>
                <div className="text-2xl font-bold text-gray-900">
                  {leaderboard.findIndex((entry) => entry._id === user._id) +
                    1 || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Your Score</div>
                <div className="text-2xl font-bold text-primary-600">
                  {user.totalScore || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  Challenges Completed
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {user.completedChallenges?.length || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
