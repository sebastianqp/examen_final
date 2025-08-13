import { Router } from 'express';
import { createAsignacion, deleteAsignacion } from '../controllers/asignacionController.js';

const router = Router();

router.post('/', createAsignacion);
router.delete('/', deleteAsignacion);

export default router;
