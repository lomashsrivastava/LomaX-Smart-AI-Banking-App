import { Request, Response } from 'express';
import Account from '../models/Account';
import User from '../models/User';
import { Card } from '../models/Card';

export const getLiveAccountData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber } = req.params;

    // Get live account with balance
    const account = await Account.findOne({ accountNumber }).populate('user', 'firstName lastName email mobile customerId');

    if (!account) {
      res.status(404).json({ success: false, message: 'Account not found' });
      return;
    }

    // Get all linked cards
    const cards = await Card.find({ accountNumber }).sort({ createdAt: -1 });

    res.json({
      success: true,
      balance: account.balance,
      status: account.status,
      cards: cards.map(c => ({
        _id: c._id,
        cardNumber: c.cardNumber,
        cardType: c.cardType,
        cardNetwork: c.cardNetwork,
        cardHolderName: c.cardHolderName,
        expiryDate: c.expiryDate,
        status: c.status,
        dailyLimit: c.dailyLimit,
        issueDate: c.issueDate,
      }))
    });
  } catch (error) {
    console.error('Live account data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const openAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, accountType, services, branchName, branchCode, ifscCode, initialDeposit } = req.body;

    // Find the user by customerId
    const user = await User.findOne({ customerId });
    
    // For mock prototype, if we don't find the user but we want to simulate success:
    const userId = user ? user._id : '000000000000000000000000'; // Fallback for pure testing without DB seeding
    
    if (!user && userId === '000000000000000000000000') {
      // Create a mock user to attach the account to
      const mockUser = new User({
        customerId,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        mobile: '9999999999',
        pan: 'XXXXXXXXXX',
        aadhaar: 'XXXXXXXXXXXX',
      });
      await mockUser.save();
    }

    const actualUser = await User.findOne({ customerId });

    if (!actualUser) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const accountNumber = `1000${Math.floor(100000 + Math.random() * 900000)}`;
    const cifNumber = `CIF${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newAccount = new Account({
      accountNumber,
      cifNumber,
      user: actualUser._id,
      accountType,
      balance: parseFloat(initialDeposit) || 0,
      branchName,
      branchCode,
      ifscCode,
      services
    });

    await newAccount.save();

    res.status(201).json({
      success: true,
      account: {
        accountNumber,
        cifNumber,
        accountOpeningDate: newAccount.createdAt,
        accountType
      }
    });

  } catch (error) {
    console.error('Account opening error:', error);
    res.status(500).json({ success: false, message: 'Failed to open account' });
  }
};

export const getCustomerAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    
    // Attempt to find user
    const user = await User.findOne({ customerId });
    if (!user) {
      // Mock response for frontend prototype if no user in DB yet
      if (customerId === 'CUST100001') {
        res.json({
          success: true,
          accounts: [
            { id: "ACC1001", _id: "ACC1001", type: "Savings Account", accountType: "Savings Account", number: "100045674021", accountNumber: "100045674021", balance: 145280.50 },
            { id: "ACC1002", _id: "ACC1002", type: "Current Account", accountType: "Current Account", number: "200089015532", accountNumber: "200089015532", balance: 25000.00 }
          ]
        });
        return;
      }
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const accounts = await Account.find({ user: user._id });
    
    const mappedAccounts = accounts.map(acc => ({
      id: acc._id,
      _id: acc._id,
      type: acc.accountType,
      accountType: acc.accountType,
      number: acc.accountNumber,
      accountNumber: acc.accountNumber,
      balance: acc.balance
    }));

    res.json({ success: true, accounts: mappedAccounts });

  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
