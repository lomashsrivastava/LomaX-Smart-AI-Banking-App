import { Router } from 'express';
import { issueCard, getCards, updateCardStatus, getCardsByAccount, updateCardControls } from '../controllers/cardController';

const router = Router();

router.post('/issue', issueCard);
router.get('/', getCards);
router.get('/account/:accountNumber', getCardsByAccount);
router.put('/:id/status', updateCardStatus);
router.put('/:id/controls', updateCardControls);

export default router;
