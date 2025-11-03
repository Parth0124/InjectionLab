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

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">InjectionLab</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/challenges" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Challenges
                </Link>
                <Link to="/leaderboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Leaderboard
                </Link>

                {/* Admin Link - Only show for admins */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Instructor Link - Show for instructors and admins */}
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                  <Link
                    to="/admin/challenges"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Manage Challenges
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
                  >
                    <span>{user?.username || 'User'}</span>
                    <span className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-700 font-medium">
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-fadeIn">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        👤 Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
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