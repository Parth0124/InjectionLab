import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getUserProgress, getUserStats } from "../../api/users";
import { getAllChallenges } from "../../api/challenges";
import StatsCard from "../../components/dashboard/StatsCard";
import ProgressChart from "../../components/dashboard/ProgressChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [progressRes, statsRes, challengesRes] = await Promise.all([
        getUserProgress(),
        getUserStats(),
        getAllChallenges(),
      ]);

      if (progressRes.success) {
        setProgress(progressRes.progress);
      }

      if (statsRes.success) {
        console.log('Stats from backend:', statsRes.stats);
        setStats(statsRes.stats);
      }

      if (challengesRes.success) {
        setChallenges(challengesRes.challenges || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error loading dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const completedCount = user?.completedChallenges?.length || 0;
  const totalChallenges = challenges.length;
  const completionRate =
    totalChallenges > 0
      ? ((completedCount / totalChallenges) * 100).toFixed(1)
      : 0;

  // Get recommended challenges (incomplete, sorted by level)
  const recommendedChallenges = challenges
    .filter((c) => !user?.completedChallenges?.includes(c._id))
    .sort((a, b) => a.level - b.level)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Track your progress and continue learning SQL injection techniques
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Score"
            value={user?.totalScore || 0}
            icon={<TrophyIcon className="h-6 w-6" />}
            color="blue"
            trend={stats?.recentScoreGain ? `+${stats.recentScoreGain}` : null}
          />
          <StatsCard
            title="Completed"
            value={`${completedCount}/${totalChallenges}`}
            icon={<AcademicCapIcon className="h-6 w-6" />}
            color="green"
            subtitle={`${completionRate}% complete`}
          />
          <StatsCard
            title="Current Streak"
            value={stats?.currentStreak || 0}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
            color="purple"
            subtitle="days"
          />
          <StatsCard
            title="Total Time"
            value={
              stats?.totalTimeSpent
                ? `${Math.floor(stats.totalTimeSpent / 60)}h`
                : "0h"
            }
            icon={<ClockIcon className="h-6 w-6" />}
            color="yellow"
            subtitle="practicing"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Chart */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                <ChartBarIcon className="h-6 w-6 text-cyan-400" />
              </div>
              {/* Pass stats.levelDistribution to ProgressChart */}
              <ProgressChart data={stats?.levelDistribution} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-white">
                Recent Achievements
              </h3>
              {user?.achievements && user.achievements.length > 0 ? (
                <div className="space-y-3">
                  {user.achievements.slice(0, 3).map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-lg border border-yellow-700/50"
                    >
                      <TrophyIcon className="h-8 w-8 text-yellow-400 mr-3" />
                      <div>
                        <div className="font-semibold text-white">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Complete challenges to earn achievements!
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 rounded-2xl p-6 border border-cyan-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-2 text-white">Keep Going!</h3>
              <p className="text-sm text-gray-300 mb-4">
                You're making great progress. Complete{" "}
                {totalChallenges - completedCount} more challenges to master SQL
                injection!
              </p>
              <button
                onClick={() => navigate("/challenges")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 w-full"
              >
                Browse Challenges
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Challenges */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
            <button
              onClick={() => navigate("/challenges")}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            >
              View All →
            </button>
          </div>

          {recommendedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-5 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/challenges/${challenge._id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        challenge.difficulty === "easy"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                          : challenge.difficulty === "medium"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30"
                          : challenge.difficulty === "hard"
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30"
                          : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {challenge.points} pts
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-500 font-semibold">
                      Level {challenge.level}
                    </span>
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center transition-colors duration-200">
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4 text-lg">
                🎉 Congratulations! You've completed all available challenges!
              </p>
              <button
                onClick={() => navigate("/leaderboard")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
              >
                View Leaderboard
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Recent Activity</h2>
          {/* Pass stats.recentActivity to RecentActivity component */}
          <RecentActivity activities={stats.recentActivity} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;