export interface User {
  id: string;
  name: string;
  email: string;
  isSubscriber: boolean;
}

export interface Theme {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export interface DailyCard {
  id: string;
  title: string;
  teaser: string;
  clues: string[];
  solution: string;
  theme: string;
  themeId?: number;
  imageUrl?: string;
  likesCount: number;
  viewsCount: number;
  generatedAt: string;
  themeRelation?: Theme;
}

export interface CustomCard {
  id: string;
  userId: string;
  title: string;
  teaser: string;
  clues: string[];
  solution: string;
  theme?: string;
  themeId?: number;
  imageUrl?: string;
  prompt?: string;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  themeRelation?: Theme;
  user?: {
    name: string;
  };
}

export type CardType = 'DAILY' | 'CUSTOM';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
} 