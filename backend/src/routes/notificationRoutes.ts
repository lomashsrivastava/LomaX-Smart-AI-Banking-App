import { Router } from 'express';
import { streamNotifications, getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Apply authenticateToken globally to notifications endpoint group
router.use(authenticateToken as any);

router.get('/stream', streamNotifications);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);

export default router;
