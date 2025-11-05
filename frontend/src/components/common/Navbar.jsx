import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ShieldCheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { isAuthenticated, user, logout, loadUser } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user data if authenticated but user is not loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // Check if user is admin or instructor
  const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';

  // Determine home link based on authentication and role
  const getHomeLink = () => {
    if (!isAuthenticated) return '/';
    if (isAdminOrInstructor) return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getHomeLink()} className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-300">
              InjectionLab
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Show Dashboard, Challenges, and Leaderboard only for students */}
                {!isAdminOrInstructor && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/challenges" 
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
                    >
                      Challenges
                    </Link>
                    <Link 
                      to="/leaderboard" 
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-200 font-medium hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]"
                    >
                      Leaderboard
                    </Link>
                  </>
                )}

                {/* Admin Link - Only show for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium group"
                  >
                    <ShieldCheckIcon className="h-5 w-5 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span className="group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Admin Dashboard</span>
                  </Link>
                )}

                {/* Manage Challenges Link - Show for instructors and admins */}
                {isAdminOrInstructor && (
                  <Link
                    to="/admin/challenges"
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
                  >
                    Manage Challenges
                  </Link>
                )}

                {/* User Management Link - Only show for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/users"
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-200 font-medium hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]"
                  >
                    Manage Users
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none group"
                  >
                    <span className="font-medium">{user?.username || 'User'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      user?.role === 'admin' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                        : user?.role === 'instructor'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/30'
                    }`}>
                      {user?.role || 'student'}
                    </span>
                    <ChevronDownIcon 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl py-2 z-50 border border-gray-700 animate-fadeIn">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                      >
                        👤 Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;