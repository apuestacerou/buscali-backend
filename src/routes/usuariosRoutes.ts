/**
 * Rutas de la API de usuarios.
 * Todas estas rutas se montan bajo /api/usuarios en app.ts.
 * Ejemplo: GET /api/usuarios → listar, GET /api/usuarios/1 → obtenerPorId.
 */

import { Router } from 'express';
import * as usuariosController from '../controllers/usuariosController';

const router = Router();

router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

export default router;
