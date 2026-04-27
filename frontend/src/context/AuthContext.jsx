import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../utils/apiError';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getCurrentUser();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthError('');
      } catch (error) {
        authService.logout();
        setUser(null);
        setAuthError(getApiErrorMessage(error, 'Unable to restore your session.'));
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setAuthError('');
    return data;
  };

  const register = async (userData) => {
    setAuthError('');
    const data = await authService.register(userData);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthError('');
  };

  const clearAuthError = () => {
    setAuthError('');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    authError,
    login,
    register,
    logout,
    clearAuthError,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
