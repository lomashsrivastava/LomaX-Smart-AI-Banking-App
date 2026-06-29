import { Router } from 'express';
import { 
  getSmartAnalytics, 
  getBudgets, 
  setBudget, 
  getSavingsGoals, 
  createSavingsGoal, 
  addSavingsGoalDeposit,
  getAdminFraudStats
} from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/smart', authenticateToken as any, getSmartAnalytics);
router.get('/budgets', authenticateToken as any, getBudgets);
router.post('/budgets', authenticateToken as any, setBudget);
router.get('/savings', authenticateToken as any, getSavingsGoals);
router.post('/savings', authenticateToken as any, createSavingsGoal);
router.post('/savings/deposit', authenticateToken as any, addSavingsGoalDeposit);
router.get('/admin/fraud', authenticateToken as any, getAdminFraudStats);

export default router;
