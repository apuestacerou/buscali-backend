import { Router } from 'express';
import { jwtAuth } from '../../../shared/middlewares/jwtAuth';
import { requireAuth } from '../../../shared/middlewares/requireAuth';
import {
  listConductores,
  getConductor,
  createConductor,
  updateConductor,
  deleteConductor,
  loginConductor,
  logoutConductor,
} from '../controllers/conductor-controller';

const router = Router();

// Aplica middlewares y conecta rutas con controladores
router.get('/', jwtAuth, requireAuth, listConductores);
router.get('/:cedula', jwtAuth, requireAuth, getConductor);
router.post('/', createConductor); // Registro público
router.put('/:cedula', jwtAuth, requireAuth, updateConductor);
router.delete('/:cedula', jwtAuth, requireAuth, deleteConductor);
router.post('/login', loginConductor);
router.post('/logout', jwtAuth, requireAuth, logoutConductor);

export default router;
