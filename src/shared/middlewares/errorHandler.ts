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
      message: 'Error de validación',
      errors: err.messages,
      details: _formatErrorDetails(err.messages),
      timestamp: new Date().toISOString(),
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Conflicto en la operación',
      errors: err.messages,
      details: _formatErrorDetails(err.messages),
      timestamp: new Date().toISOString(),
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'No autorizado',
      errors: err.messages,
      details: _formatErrorDetails(err.messages),
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Error interno del servidor',
    errors: [err.message || 'Unexpected error'],
    details: err.message || 'Unexpected error',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Formatea los errores para una mejor presentación
 */
function _formatErrorDetails(errors: string[]): string {
  return errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n');
}
