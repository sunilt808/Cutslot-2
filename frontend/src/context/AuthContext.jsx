import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Stable API instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:8000',
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 Unauthorized globally
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          // Only redirect if not already on auth page
          if (!window.location.pathname.includes('/auth')) {
             window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/token', formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    await checkUser();
    return true;
  };

  const signup = async (username, full_name, email, password, role = 'customer', floor = 1) => {
    await api.post('/users/', { username, full_name, email, password, role, assigned_floor: floor });
  };

  const subscribe = async (service_id) => {
    const res = await api.post('/subscribe/', { service_id });
    await checkUser();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/auth';
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, subscribe, logout, loading, api, refreshUser: checkUser, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
