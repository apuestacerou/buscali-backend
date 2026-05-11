import { Router } from 'express';
import {
  createUsuario,
  loginUsuario,
  forgotPasswordUsuario,
  resetPasswordUsuario,
} from '../controllers/usuario-controller';

const router = Router();

router.post('/', createUsuario);
router.post('/login', loginUsuario);
router.post('/forgot-password', forgotPasswordUsuario);
router.post('/reset-password', resetPasswordUsuario);

export default router;
