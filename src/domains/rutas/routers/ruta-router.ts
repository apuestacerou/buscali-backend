import { Router } from 'express';
import { listRuta, createRuta, getRuta } from '../controllers/ruta-controller';

const router = Router();
router.get('/', listRuta);
router.post('/', createRuta);
router.get('/:nombre_ruta', getRuta);

export default router;
