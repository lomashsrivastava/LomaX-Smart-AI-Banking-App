import { Router } from 'express';
import { 
  transferMoney, 
  depositMoney, 
  withdrawMoney, 
  getHistory, 
  lookupAccount, 
  getAccountHistory, 
  deleteTransaction, 
  clearAllTransactions,
  exportPDFStatement,
  exportCSVStatement
} from '../controllers/transactionController';

const router = Router();

router.get('/lookup/:accountNumber', lookupAccount);
router.post('/transfer', transferMoney);
router.post('/deposit', depositMoney);
router.post('/withdraw', withdrawMoney);
router.get('/history', getHistory);
router.get('/account/:accountNumber', getAccountHistory);
router.get('/statement/pdf', exportPDFStatement);
router.get('/statement/csv', exportCSVStatement);
router.delete('/clear-all', clearAllTransactions);
router.delete('/:id', deleteTransaction);

export default router;

