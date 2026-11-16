import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setUser({ email: 'test@example.com', fullName: 'Test Viewer' });
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Bypassing API call for demo purposes due to Docker unavailability
      const response = { data: { token: 'mockToken123', fullName: 'Mock User' } };
      const { token, fullName } = response.data;
      localStorage.setItem('token', token);
      setUser({ email, fullName });
      toast.success('Successfully logged in (Demo Mode)!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ email, fullName });
      toast.success('Registration successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out gracefully');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
