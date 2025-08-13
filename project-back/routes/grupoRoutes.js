import { Router } from 'express';
import { getGrupos } from '../controllers/grupoController.js';

const router = Router();

router.get('/', getGrupos);

export default router;
