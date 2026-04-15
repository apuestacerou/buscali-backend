/**
 * Middleware de Rate Limiting para proteger contra ataques de fuerza bruta.
 * Limita el número de intentos de login por IP y otros endpoints por usuario.
 */

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter para login: máximo 5 intentos por IP cada 15 minutos
 * Protección contra fuerza bruta
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos',
    retryAfter: '15 minutos',
  },
  standardHeaders: false, // Desactivar headers RateLimit-*
  legacyHeaders: false, // Desactivar X-RateLimit-*
  skip: (req) => {
    // No aplicar rate limit si viene de localhost (desarrollo)
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
});

/**
 * Rate limiter para registro de usuarios: máximo 3 intentos por IP cada hora
 * Prevenir spam de registros
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros
  message: {
    error: 'Demasiados registros desde esta IP. Intenta de nuevo más tarde',
    retryAfter: '1 hora',
  },
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
});

/**
 * Rate limiter general para API: máximo 100 solicitudes por IP cada 15 minutos
 * Protección general contra abuso
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes
  message: {
    error: 'Demasiadas solicitudes. Intenta de nuevo más tarde',
  },
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
});

/**
 * Rate limiter para evaluación de contraseña: máximo 20 intentos por IP cada minuto
 * Permite evaluación pero previene abuso
 */
export const passwordStrengthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // máximo 20 intentos
  message: {
    error: 'Demasiadas solicitudes de evaluación. Intenta de nuevo en 1 minuto',
  },
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
});
