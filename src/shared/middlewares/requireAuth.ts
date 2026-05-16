import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/error.class';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth) {
    return next(new UnauthorizedError('Inicia sesión para acceder a esta sección.'));
  }
  next();
}
