/**
 * Middleware de autenticación con JWT.
 * Protege rutas verificando que el usuario tenga un token válido.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender el tipo de Request para incluir el usuario
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email?: string;
    telefono?: string;
    role?: string;
  };
}

/**
 * Middleware que verifica el JWT en el header Authorization
 * Formato: Authorization: Bearer <token>
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Token no proporcionado o formato inválido',
        example: 'Authorization: Bearer <token>',
      });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    const secret = process.env.JWT_SECRET || 'tu_secret_muy_seguro_aqui';

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email?: string;
      telefono?: string;
      role?: string;
    };

    // Asignar usuario al request para usarlo en controladores
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token inválido' });
    } else {
      res.status(401).json({ error: 'Error de autenticación' });
    }
  }
}

/**
 * Genera un JWT para un usuario
 * @param userId - ID del usuario
 * @param email - Email del usuario (opcional)
 * @param role - Rol del usuario (opcional)
 * @returns Token JWT
 */
export function generateToken(userId: number, email?: string, role?: string): string {
  const secret = process.env.JWT_SECRET || 'tu_secret_muy_seguro_aqui';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'; // Expira en 7 días

  const token = jwt.sign(
    {
      id: userId,
      email,
      role,
    },
    secret,
    { expiresIn }
  );

  return token;
}

/**
 * Middleware para requerir un rol específico
 * @param requiredRole - Rol requerido (ej: 'administrador')
 */
export function requireRole(requiredRole: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({ error: `Se requiere rol: ${requiredRole}` });
      return;
    }

    next();
  };
}
