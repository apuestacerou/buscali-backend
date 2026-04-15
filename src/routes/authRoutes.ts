/**
 * Rutas de autenticación (montadas bajo /api/auth).
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { loginLimiter, passwordStrengthLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, authController.login);
router.get('/password-strength', passwordStrengthLimiter, authController.getPasswordStrength);

export default router;
