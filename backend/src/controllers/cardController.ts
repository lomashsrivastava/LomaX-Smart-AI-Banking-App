import { Request, Response } from 'express';
import { Card } from '../models/Card';

export const issueCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber, cardHolderName, cardType, cardNetwork } = req.body;

    // Generate random 16 digit card number
    const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    // Generate random CVV
    const cvv = Math.floor(100 + Math.random() * 900).toString();
    // Expiry date (5 years from now)
    const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5));
    const expiryDateStr = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).slice(2)}`;

    const newCard = new Card({
      accountNumber,
      cardHolderName,
      cardNumber,
      cardType,
      cardNetwork,
      cvv,
      expiryDate: expiryDateStr,
      status: 'Active',
      dailyLimit: cardType === 'Credit' ? 100000 : 50000
    });

    await newCard.save();

    res.status(201).json({
      success: true,
      message: 'Card issued successfully',
      data: newCard
    });
  } catch (error) {
    console.error('Error issuing card:', error);
    res.status(500).json({ success: false, message: 'Failed to issue card' });
  }
};

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cards' });
  }
};

export const getCardsByAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber } = req.params;
    const cards = await Card.find({ accountNumber }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error('Error fetching cards by account:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cards' });
  }
};

export const updateCardStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const card = await Card.findById(id);
    if (!card) {
      res.status(404).json({ success: false, message: 'Card not found' });
      return;
    }

    card.status = status;
    await card.save();

    res.status(200).json({ success: true, message: 'Card status updated successfully', data: card });
  } catch (error) {
    console.error('Error updating card status:', error);
    res.status(500).json({ success: false, message: 'Failed to update card status' });
  }
};

export const updateCardControls = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { dailyLimit, isInternational, isOnline, isContactless, pin, status } = req.body;

    const card = await Card.findById(id);
    if (!card) {
      res.status(404).json({ success: false, message: 'Card not found' });
      return;
    }

    if (dailyLimit !== undefined) card.dailyLimit = Number(dailyLimit);
    if (isInternational !== undefined) card.isInternational = Boolean(isInternational);
    if (isOnline !== undefined) card.isOnline = Boolean(isOnline);
    if (isContactless !== undefined) card.isContactless = Boolean(isContactless);
    if (pin !== undefined) card.pin = String(pin);
    if (status !== undefined) card.status = status;

    await card.save();
    res.status(200).json({ success: true, message: 'Card controls updated successfully', data: card });
  } catch (error) {
    console.error('Error updating card controls:', error);
    res.status(500).json({ success: false, message: 'Failed to update card controls' });
  }
};
