import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('foodbridge_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('foodbridge_user');
          localStorage.removeItem('foodbridge_token');
        }
      } catch {
        // Token invalid or expired
        setUser(null);
        localStorage.removeItem('foodbridge_user');
        localStorage.removeItem('foodbridge_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('foodbridge_token', data.token);
      }
      localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.success) {
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('foodbridge_token', data.token);
      }
      localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout server request failed:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('foodbridge_user');
      localStorage.removeItem('foodbridge_token');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('foodbridge_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isDonor: user?.role === 'Donor',
    isRecipient: user?.role === 'Recipient',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

