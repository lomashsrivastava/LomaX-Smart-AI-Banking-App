import { Router } from 'express';
import { createScheduledTransfer, getScheduledTransfers, cancelScheduledTransfer } from '../controllers/scheduledTransferController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken as any, createScheduledTransfer);
router.get('/', authenticateToken as any, getScheduledTransfers);
router.patch('/:id/cancel', authenticateToken as any, cancelScheduledTransfer);

export default router;
