import { Router } from 'express';
import { applyLoan, getLoans, updateLoanStatus, deleteLoan } from '../controllers/loanController';

const router = Router();

router.post('/apply', applyLoan);
router.get('/', getLoans);
router.put('/:id/status', updateLoanStatus);
router.delete('/:id', deleteLoan);

export default router;
