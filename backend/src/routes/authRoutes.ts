import { Router } from 'express';
import { 
  login, 
  registerCustomer, 
  getAllCustomers, 
  getCustomerDetails, 
  deleteCustomer, 
  lookupCustomerById,
  verify2FA,
  get2FAStatus,
  toggle2FA,
  getActiveSessions,
  revokeSession,
  logout,
  refreshToken,
  changePassword
} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/register', registerCustomer);
router.get('/customers', getAllCustomers);
router.get('/lookup/customer/:customerId', lookupCustomerById);
router.get('/customers/:id', getCustomerDetails);
router.delete('/customers/:id', deleteCustomer);

router.post('/verify-2fa', verify2FA);
router.get('/2fa/status', authenticateToken as any, get2FAStatus);
router.post('/2fa/toggle', authenticateToken as any, toggle2FA);
router.get('/sessions', authenticateToken as any, getActiveSessions);
router.delete('/sessions/:sessionId', authenticateToken as any, revokeSession);
router.post('/logout', authenticateToken as any, logout);
router.post('/refresh', refreshToken);
router.post('/change-password', authenticateToken as any, changePassword);

export default router;
