import { Router } from 'express';
import { createTicket, getTickets, updateTicketStatus, lookupTicket } from '../controllers/ticketController';

const router = Router();

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/lookup/:ticketId', lookupTicket);
router.put('/:id/status', updateTicketStatus);

export default router;
