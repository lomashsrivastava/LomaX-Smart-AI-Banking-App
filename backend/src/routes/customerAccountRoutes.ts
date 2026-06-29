import { Router } from 'express';
import {
  getPendingAccounts,
  getApprovedAccounts,
  getAllCustomerAccounts,
  approveAccount,
  rejectAccount,
  deleteCustomerAccount,
  updateCustomerAccount
} from '../controllers/customerAccountController';

const router = Router();

router.get('/pending', getPendingAccounts);
router.get('/approved', getApprovedAccounts);
router.get('/all', getAllCustomerAccounts);
router.post('/:id/approve', approveAccount);
router.post('/:id/reject', rejectAccount);
router.delete('/:id', deleteCustomerAccount);
router.put('/:id', updateCustomerAccount);

export default router;
