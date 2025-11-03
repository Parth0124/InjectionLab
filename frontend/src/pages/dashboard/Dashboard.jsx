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
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress and continue learning SQL injection techniques
          </p>
        </div>

        {/* Stats Cards */}
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
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Progress</h2>
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              {progress?.challengesByDifficulty ? (
                <ProgressChart data={progress.challengesByDifficulty} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Start completing challenges to see your progress!
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">
                Recent Achievements
              </h3>
              {user?.achievements && user.achievements.length > 0 ? (
                <div className="space-y-3">
                  {user.achievements.slice(0, 3).map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-yellow-50 rounded-lg"
                    >
                      <TrophyIcon className="h-8 w-8 text-yellow-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Complete challenges to earn achievements!
                </p>
              )}
            </div>

            <div className="card bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold mb-2">Keep Going!</h3>
              <p className="text-sm text-gray-700 mb-4">
                You're making great progress. Complete{" "}
                {totalChallenges - completedCount} more challenges to master SQL
                injection!
              </p>
              <button
                onClick={() => navigate("/challenges")}
                className="btn-primary w-full"
              >
                Browse Challenges
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Challenges */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recommended for You</h2>
            <button
              onClick={() => navigate("/challenges")}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {recommendedChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="border rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/challenges/${challenge._id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        challenge.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : challenge.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : challenge.difficulty === "hard"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-primary-600 font-semibold">
                      {challenge.points} pts
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Level {challenge.level}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                🎉 Congratulations! You've completed all available challenges!
              </p>
              <button
                onClick={() => navigate("/leaderboard")}
                className="btn-primary"
              >
                View Leaderboard
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <RecentActivity activities={progress?.recentActivity || []} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
