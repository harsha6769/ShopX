import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    // Load this user's cart
    window.dispatchEvent(new Event('userChanged'));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { name, email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear cart display
    window.dispatchEvent(new Event('userChanged'));
    window.location.href = '/';
  };
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  });

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, authHeader, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);