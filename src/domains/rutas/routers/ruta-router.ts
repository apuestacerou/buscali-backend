import { Router } from 'express';
import { jwtAuth } from '../../../shared/middlewares/jwtAuth';
import { requireAuth } from '../../../shared/middlewares/requireAuth';
import {
  listRuta,
  createRuta,
  getRuta,
  getRutaByEmpresa,
  getRutaByDestino,
  updateRuta,
} from '../controllers/ruta-controller';

const router = Router();
router.get('/', listRuta);
router.post('/', jwtAuth, requireAuth, createRuta);
router.get('/:nombre_ruta', getRuta);
router.get('/destino/:destino', getRutaByDestino);
router.get('/empresa/:nombre_empresa', getRutaByEmpresa);
router.put('/:nombre_ruta', jwtAuth, requireAuth, updateRuta);

export default router;
