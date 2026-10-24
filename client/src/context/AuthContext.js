import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const persist = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  const login = async (email, password) => persist((await api.post('/auth/login', { email, password })).data);
  const register = async (form) => persist((await api.post('/auth/register', form)).data);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
};
export const useAuth = () => useContext(AuthCtx);
