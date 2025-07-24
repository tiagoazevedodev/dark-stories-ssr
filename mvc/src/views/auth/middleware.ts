// src/auth/middleware.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// Extend Express Request type to include isAuthenticated
declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: () => boolean;
      user?: { id?: string };
    }
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect('/login');
}

export async function isOwner(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const card = await prisma.customCard.findUnique({ where: { id } });

    if (!card || card.userId !== userId) {
      return res.status(403).send('Acesso negado');
    }

    next();
  } catch (error) {
    console.error('Erro no isOwner:', error);
    return res.status(500).send('Erro interno');
  }
}
