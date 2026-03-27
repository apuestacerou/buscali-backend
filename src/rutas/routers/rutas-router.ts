import { Router } from 'express';
import { listRuta, createRuta } from '../controllers/ruta-controller';

const router = Router();
router.get('/', listRuta);
router.post('/', createRuta);

export default router;
