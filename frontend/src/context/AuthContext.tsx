import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@dark-stories/token');
    const savedUser = localStorage.getItem('@dark-stories/user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        authAPI.getMe().then(({ user }) => {
          setUser(user);
          localStorage.setItem('@dark-stories/user', JSON.stringify(user));
        }).catch(() => {
          // Token is invalid
          localStorage.removeItem('@dark-stories/token');
          localStorage.removeItem('@dark-stories/user');
          setUser(null);
        });
      } catch (error) {
        localStorage.removeItem('@dark-stories/token');
        localStorage.removeItem('@dark-stories/user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      localStorage.setItem('@dark-stories/token', response.token);
      localStorage.setItem('@dark-stories/user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      setUser(response.user);
      localStorage.setItem('@dark-stories/token', response.token);
      localStorage.setItem('@dark-stories/user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@dark-stories/token');
    localStorage.removeItem('@dark-stories/user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 