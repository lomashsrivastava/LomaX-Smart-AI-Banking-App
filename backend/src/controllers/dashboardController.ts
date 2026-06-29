import { Request, Response } from 'express';
import Account from '../models/Account';
import { Branch } from '../models/Branch';
import Transaction from '../models/Transaction';
import CustomerAccount from '../models/CustomerAccount';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalBranches = await Branch.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const totalCustomers = await CustomerAccount.countDocuments();
    
    // Calculate total balance across all accounts
    const accounts = await Account.find({}, 'balance');
    const totalBalance = accounts.reduce((acc, account) => acc + (account.balance || 0), 0);

    // Get 5 most recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sourceAccount', 'accountNumber')
      .populate('targetAccount', 'accountNumber');

    // Get basic stats for last 30 days transactions volume
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTxVolume = await Transaction.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBranches,
        totalAccounts,
        totalCustomers,
        totalBalance,
        recentTransactions,
        monthlyTxVolume: recentTxVolume.length > 0 ? recentTxVolume[0].totalAmount : 0,
        monthlyTxCount: recentTxVolume.length > 0 ? recentTxVolume[0].count : 0,
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
