import { Router } from 'express';
import { openAccount, getCustomerAccounts, getLiveAccountData } from '../controllers/accountController';

const router = Router();

router.post('/new', openAccount);
router.get('/live/:accountNumber', getLiveAccountData);
router.get('/:customerId', getCustomerAccounts);

export default router;

