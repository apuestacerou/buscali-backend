/**
 * Rutas de la API de usuarios.
 * Todas estas rutas se montan bajo /api/usuarios en app.ts.
 * Ejemplo: GET /api/usuarios → listar, GET /api/usuarios/1 → obtenerPorId.
 */

import { Router } from 'express';
import * as usuariosController from '../controllers/usuariosController';
import { authMiddleware } from '../middleware/auth';
import { registerLimiter } from '../middleware/rateLimiter';

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/', registerLimiter, usuariosController.crear);
router.get('/check/availability', usuariosController.checkAvailability);

// Rutas protegidas (requieren JWT)
router.get('/', authMiddleware, usuariosController.listar);
router.get('/:id', authMiddleware, usuariosController.obtenerPorId);
router.put('/:id', authMiddleware, usuariosController.actualizar);
router.delete('/:id', authMiddleware, usuariosController.eliminar);

export default router;
