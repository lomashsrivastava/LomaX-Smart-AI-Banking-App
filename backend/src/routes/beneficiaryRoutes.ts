import { Router } from 'express';
import { addBeneficiary, getBeneficiaries, deleteBeneficiary } from '../controllers/beneficiaryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken as any, addBeneficiary);
router.get('/', authenticateToken as any, getBeneficiaries);
router.delete('/:id', authenticateToken as any, deleteBeneficiary);

export default router;
