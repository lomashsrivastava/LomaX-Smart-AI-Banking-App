import { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, subject, category, priority, description } = req.body;

    const ticketId = `TKT-${Math.floor(1000000 + Math.random() * 9000000).toString()}`;
    
    const newTicket = new Ticket({
      ticketId,
      customerId,
      subject,
      category,
      priority,
      description,
      status: 'Open'
    });

    await newTicket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: newTicket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
};

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

export const updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({ success: true, message: 'Ticket status updated successfully', data: ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ success: false, message: 'Failed to update ticket status' });
  }
};

export const lookupTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket not found' });
      return;
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error looking up ticket:', error);
    res.status(500).json({ success: false, message: 'Failed to look up ticket' });
  }
};
