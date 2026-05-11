import { Router } from 'express';
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
router.post('/', createRuta);
router.get('/:nombre_ruta', getRuta);
router.get('/destino/:destino', getRutaByDestino);
router.get('/empresa/:nombre_empresa', getRutaByEmpresa);
router.put('/:nombre_ruta', updateRuta);

export default router;
