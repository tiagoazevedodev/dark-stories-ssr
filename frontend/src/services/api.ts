import axios from 'axios';
import { User, DailyCard, CustomCard, Theme, AuthResponse, CardType } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@dark-stories/token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@dark-stories/token');
      localStorage.removeItem('@dark-stories/user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Cards API
export const cardsAPI = {
  getDailyCard: async (): Promise<{ card: DailyCard | null }> => {
    const response = await api.get('/api/cards/daily');
    return response.data;
  },

  getDailyCardById: async (id: string): Promise<{ card: DailyCard }> => {
    const response = await api.get(`/api/cards/daily/${id}`);
    return response.data;
  },

  getCustomCards: async (): Promise<{ cards: CustomCard[] }> => {
    const response = await api.get('/api/cards/custom');
    return response.data;
  },

  createCustomCard: async (card: {
    title: string;
    teaser: string;
    clues: string[];
    solution: string;
    theme?: string;
    themeId?: number;
  }): Promise<{ card: CustomCard }> => {
    const response = await api.post('/api/cards/custom', card);
    return response.data;
  },

  getCustomCardById: async (id: string): Promise<{ card: CustomCard }> => {
    const response = await api.get(`/api/cards/custom/${id}`);
    return response.data;
  },

  updateCustomCard: async (id: string, card: {
    title: string;
    teaser: string;
    clues: string[];
    solution: string;
    theme?: string;
    themeId?: number;
  }): Promise<{ card: CustomCard }> => {
    const response = await api.put(`/api/cards/custom/${id}`, card);
    return response.data;
  },

  deleteCustomCard: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/cards/custom/${id}`);
    return response.data;
  },

  likeCard: async (cardId: string, cardType: CardType): Promise<{ liked: boolean }> => {
    const response = await api.post(`/api/cards/${cardId}/like`, { cardType });
    return response.data;
  },
};

// Themes API
export const themesAPI = {
  getThemes: async (): Promise<{ themes: Theme[] }> => {
    const response = await api.get('/api/themes');
    return response.data;
  },
};

export default api; 