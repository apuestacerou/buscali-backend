import { Router } from 'express';
import * as usuariosController from '../controllers/usuariosController';

const router = Router();

router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

export default router;
