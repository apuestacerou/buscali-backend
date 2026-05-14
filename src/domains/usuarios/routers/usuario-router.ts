import { Router } from 'express';
import { jwtAuth } from '../../../shared/middlewares/jwtAuth';
import { requireAuth } from '../../../shared/middlewares/requireAuth';
import {
  createUsuario,
  loginUsuario,
  forgotPasswordUsuario,
  resetPasswordUsuario,
  listUsuarios,
  getUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuario-controller';

const router = Router();

/** Registro público (sin sesión previa). */
router.post('/', createUsuario);
router.post('/login', loginUsuario);
router.post('/forgot-password', forgotPasswordUsuario);
router.post('/reset-password', jwtAuth, requireAuth, resetPasswordUsuario);
router.get('/', jwtAuth, requireAuth, listUsuarios);
router.get('/:id', jwtAuth, requireAuth, getUsuario);
router.put('/:id', jwtAuth, requireAuth, updateUsuario);
router.delete('/:id', jwtAuth, requireAuth, deleteUsuario);

export default router;
