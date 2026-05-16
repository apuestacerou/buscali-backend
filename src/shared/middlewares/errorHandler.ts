import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  ConflictError,
  UnauthorizedError,
} from '../errors/error.class';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error('Error capturado:', err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message:
        'Revisa los datos enviados; hay campos que no cumplen lo requerido.',
      errors: err.messages,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message:
        'No pudimos guardar los cambios porque ya existe información similar.',
      errors: err.messages,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Necesitas iniciar sesión para continuar.',
      errors: err.messages,
    });
  }

  return res.status(500).json({
    status: 'error',
    code: 500,
    message:
      'Ocurrió un problema en el servidor. Intenta de nuevo en unos minutos.',
    errors: [err.message || 'Error inesperado'],
  });
}
