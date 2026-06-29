import { Router } from 'express';
import { createBranch, getBranches, getBranchById, updateBranch, deleteBranch, getBranchRegions } from '../controllers/branchController';

const router = Router();

router.post('/', createBranch);
router.get('/', getBranches);
router.get('/regions', getBranchRegions);
router.get('/:id', getBranchById);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;

