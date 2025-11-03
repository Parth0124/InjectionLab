import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Import pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Dashboard from './pages/dashboard/Dashboard';
import Leaderboard from './pages/dashboard/Leaderboard';
import Challenges from './pages/challenges/Challenges';
import ChallengeDetail from './pages/challenges/ChallengeDetail';
import SQLPractice from './pages/practice/SQLPractice';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ChallengeManagement from './pages/admin/ChallengeManagement';

function Router() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <PrivateRoute>
                <Challenges />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges/:id"
            element={
              <PrivateRoute>
                <ChallengeDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/practice/:challengeId"
            element={
              <PrivateRoute>
                <SQLPractice />
              </PrivateRoute>
            }
          />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute adminOnly>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/challenges"
            element={
              <PrivateRoute instructorOrAdmin>
                <ChallengeManagement />
              </PrivateRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default Router;