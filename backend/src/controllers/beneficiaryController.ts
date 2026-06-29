import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Beneficiary from '../models/Beneficiary';
import User from '../models/User';
import Account from '../models/Account';

export const addBeneficiary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { name, accountNumber, ifscCode, bankName } = req.body;

    if (!name || !accountNumber || !ifscCode) {
      res.status(400).json({ success: false, message: 'All fields (name, accountNumber, ifscCode) are required.' });
      return;
    }

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    // Verify if account exists in our system (for internal transfers verification)
    const targetAccount = await Account.findOne({ accountNumber });
    
    // Check if beneficiary is already added
    const existing = await Beneficiary.findOne({ user: user._id, accountNumber });
    if (existing) {
      res.status(409).json({ success: false, message: 'Beneficiary has already been added to your account.' });
      return;
    }

    const newBeneficiary = new Beneficiary({
      user: user._id,
      name,
      accountNumber,
      ifscCode,
      bankName: bankName || (targetAccount ? 'LomaX Bank' : 'Other Bank')
    });

    await newBeneficiary.save();
    res.status(201).json({ 
      success: true, 
      data: newBeneficiary, 
      isInternal: !!targetAccount,
      message: 'Beneficiary added successfully.' 
    });
  } catch (error: any) {
    console.error('Add beneficiary error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getBeneficiaries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const list = await Beneficiary.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteBeneficiary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { id } = req.params;

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const deleted = await Beneficiary.findOneAndDelete({ _id: id, user: user._id });
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Beneficiary not found or unauthorized.' });
      return;
    }

    res.json({ success: true, message: 'Beneficiary successfully deleted.' });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
