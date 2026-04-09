/**
 * Rutas de autenticación (montadas bajo /api/auth).
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);

export default router;
