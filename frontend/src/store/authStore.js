import { create } from 'zustand';
import { login, register, getProfile } from '../api/auth';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      });
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      });
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await getProfile();
      set({
        user: response.user,
        isAuthenticated: true
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    toast.success('Logged out successfully');
  },

  // Helper to check if user is admin
  isAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'admin';
  },

  // Helper to check if user is instructor or admin
  isInstructorOrAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'instructor' || state.user?.role === 'admin';
  }
}));

export default useAuthStore;