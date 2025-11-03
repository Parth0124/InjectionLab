import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from './LoadingSpinner';

function PrivateRoute({ children, adminOnly = false, instructorOrAdmin = false }) {
  const { isAuthenticated, user, loadUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check admin-only routes
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // Check instructor or admin routes
  if (instructorOrAdmin && user.role !== 'instructor' && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PrivateRoute;