import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; addresses?: Address[] }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const rehydrate = useCallback(async () => {
    const stored = localStorage.getItem('token');
    if (!stored) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user || data);
    } catch {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { rehydrate(); }, [rehydrate]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success('Logged in successfully!');
  };

  const register = async (body: { name: string; email: string; password: string; phone?: string }) => {
    const { data } = await api.post('/auth/register', body);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success('Account created successfully!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out');
  };

  const updateProfile = async (body: { name?: string; phone?: string; addresses?: Address[] }) => {
    const { data } = await api.put('/auth/update-profile', body);
    setUser(data.user || data);
    toast.success('Profile updated!');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
    toast.success('Password changed!');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
