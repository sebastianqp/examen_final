import { Router } from 'express';
import {
  getAllInvestigadores,
  getInvestigadorById,
  createInvestigador,
  updateInvestigador,
  deleteInvestigador
} from '../controllers/investigadorController.js';

const router = Router();

router.get('/', getAllInvestigadores);
router.get('/:id', getInvestigadorById);
router.post('/', createInvestigador);
router.put('/:id', updateInvestigador);
router.delete('/:id', deleteInvestigador);

export default router;
