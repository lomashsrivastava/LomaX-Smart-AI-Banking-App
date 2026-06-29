import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import ScheduledTransfer from '../models/ScheduledTransfer';
import User from '../models/User';
import Account from '../models/Account';

export const createScheduledTransfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { 
      sourceAccountNumber, 
      targetAccountNumber, 
      payeeName, 
      ifscCode, 
      amount, 
      remarks, 
      transferMode,
      scheduleType,
      frequency,
      scheduledDate 
    } = req.body;

    if (!sourceAccountNumber || !targetAccountNumber || !payeeName || !amount || !transferMode || !scheduleType) {
      res.status(400).json({ success: false, message: 'Missing mandatory fields.' });
      return;
    }

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    // Verify ownership of the source account
    const sourceAccount = await Account.findOne({ accountNumber: sourceAccountNumber, user: user._id });
    if (!sourceAccount) {
      res.status(403).json({ success: false, message: 'Unauthorized. You do not own the source account.' });
      return;
    }

    // Calculate next run date
    let nextRun = new Date();
    if (scheduleType === 'one-time') {
      if (!scheduledDate) {
        res.status(400).json({ success: false, message: 'Scheduled date is required for one-time future transfers.' });
        return;
      }
      nextRun = new Date(scheduledDate);
      if (nextRun.getTime() < Date.now()) {
        res.status(400).json({ success: false, message: 'Scheduled date must be in the future.' });
        return;
      }
    } else {
      // Recurring transfer next run
      if (!frequency) {
        res.status(400).json({ success: false, message: 'Frequency (daily, weekly, monthly) is required for recurring transfers.' });
        return;
      }
      // Defaults to starting next day
      nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(9, 0, 0, 0); // Default daily execution window
    }

    const scheduledTransfer = new ScheduledTransfer({
      user: user._id,
      sourceAccountNumber,
      targetAccountNumber,
      payeeName,
      ifscCode,
      amount: parseFloat(amount),
      remarks,
      transferMode,
      scheduleType,
      frequency,
      scheduledDate: scheduleType === 'one-time' ? new Date(scheduledDate) : undefined,
      nextRunDate: nextRun,
      status: 'pending'
    });

    await scheduledTransfer.save();
    res.status(201).json({ 
      success: true, 
      data: scheduledTransfer, 
      message: 'Transfer scheduled successfully.' 
    });
  } catch (error: any) {
    console.error('Create scheduled transfer error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getScheduledTransfers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const list = await ScheduledTransfer.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    console.error('Get scheduled transfers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelScheduledTransfer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { id } = req.params;

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const updated = await ScheduledTransfer.findOneAndUpdate(
      { _id: id, user: user._id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Scheduled transfer not found, already completed, or unauthorized.' });
      return;
    }

    res.json({ success: true, data: updated, message: 'Scheduled transfer successfully cancelled.' });
  } catch (error) {
    console.error('Cancel scheduled transfer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
