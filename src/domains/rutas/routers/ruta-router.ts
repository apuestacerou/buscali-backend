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
  sugerirRutas,
  puntosAccesoRuta,
} from '../controllers/ruta-controller';

const router = Router();
router.get('/', listRuta);
router.get('/sugerir', sugerirRutas);
router.get('/puntos-acceso', puntosAccesoRuta);
router.get('/destino/:destino', getRutaByDestino);
router.get('/empresa/:nombre_empresa', getRutaByEmpresa);
router.get('/:nombre_ruta', getRuta);
router.post('/', jwtAuth, requireAuth, createRuta);
router.put('/:nombre_ruta', jwtAuth, requireAuth, updateRuta);

export default router;
