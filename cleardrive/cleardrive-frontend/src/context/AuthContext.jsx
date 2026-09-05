import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cleardrive_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem('cleardrive_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await authService.login({ email, password });
    localStorage.setItem('cleardrive_token', res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(name, email, password) {
    const res = await authService.register({ name, email, password });
    localStorage.setItem('cleardrive_token', res.token);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    localStorage.removeItem('cleardrive_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
