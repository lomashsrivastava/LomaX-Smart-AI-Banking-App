import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import CustomerAccount from '../models/CustomerAccount';
import User from '../models/User';
import LedgerEntry from '../models/LedgerEntry';
import { createNotification } from '../services/notificationService';
import { generatePDFStatement, generateCSVStatement } from '../services/statementService';
import mongoose from 'mongoose';

// Define transfer limits
const MIN_TRANSFER = 1;
const MAX_TRANSFER = 1000000; // 10 Lakhs per single transfer
const DAILY_LIMIT = 5000000; // 50 Lakhs per day
const MONTHLY_LIMIT = 20000000; // 2 Crores per month

// Helper for ACID Transactions with fallback
export const runInTransaction = async <T>(callback: (session: mongoose.ClientSession | null) => Promise<T>): Promise<T> => {
  let session: mongoose.ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (err: any) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    // Fallback if standalone MongoDB does not support transactions/sessions
    if (err.message && (err.message.includes('replica set') || err.message.includes('sessions are not supported'))) {
      console.warn('MongoDB does not support transactions/sessions. Falling back to non-transactional execution.');
      return await callback(null);
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

const generateReferenceId = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `LMX${dateStr}${randDigits}`;
};

export const lookupAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber } = req.params;

    // First try Account collection (approved accounts)
    const account = await Account.findOne({ accountNumber }).populate('user', 'firstName lastName email mobile customerId');

    if (account && account.user) {
      const user = account.user as any;
      res.json({
        success: true,
        account: {
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          holderName: `${user.firstName} ${user.lastName}`,
          customerId: user.customerId,
          email: user.email,
          balance: account.balance,
          status: account.status,
          branchName: account.branchName,
        }
      });
      return;
    }

    // Fallback: look in CustomerAccount collection
    const ca = await CustomerAccount.findOne({ accountNumber, status: 'approved' });
    if (ca) {
      res.json({
        success: true,
        account: {
          accountNumber: ca.accountNumber,
          accountType: ca.accountType,
          holderName: `${ca.firstName} ${ca.lastName}`,
          customerId: ca.customerId,
          email: ca.email,
          balance: ca.initialDeposit,
          status: 'active',
          branchName: ca.branchName,
        }
      });
      return;
    }

    res.status(404).json({ success: false, message: 'Account not found. Please check the account number.' });
  } catch (error) {
    console.error('Lookup error:', error);
    res.status(500).json({ success: false, message: 'Server error during lookup' });
  }
};


export const transferMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceAccount, targetAccount, amount, remarks, payeeName, payeeAccount, ifscCode, upiId } = req.body;
    const transferType = req.body.transferType || req.body.transferMode || 'Internal Transfer';
    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid transfer amount' });
      return;
    }

    // Prototype mock bypass
    if (sourceAccount === 'ACC1001') {
      const transactionId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
      const mockUser = await User.findOne({ customerId: 'CUST100001' });
      if (mockUser) {
        await createNotification(
          mockUser._id.toString(),
          'Amount Debited (Prototype)',
          `₹${transferAmount.toLocaleString('en-IN')} has been debited from your mock account ACC1001 for transfer to ${payeeName || 'external account'}.`,
          'transaction'
        );
      }
      res.status(201).json({
        success: true,
        transaction: {
          transactionId,
          transferType,
          amount: transferAmount,
          timestamp: new Date().toISOString(),
          payeeName,
          payeeAccount,
          upiId
        }
      });
      return;
    }

    // 1. Idempotency Check
    const idempotencyKey = (req.headers['x-idempotency-key'] || req.body.idempotencyKey) as string;
    if (idempotencyKey) {
      const existingTxn = await Transaction.findOne({ idempotencyKey });
      if (existingTxn) {
        res.status(200).json({
          success: true,
          transaction: {
            transactionId: existingTxn.transactionId,
            transferType: existingTxn.transferMode,
            amount: existingTxn.amount,
            timestamp: existingTxn.createdAt,
            payeeName: existingTxn.payeeName,
            payeeAccount: existingTxn.payeeAccount,
            upiId: existingTxn.upiId
          },
          message: 'Duplicate request detected. Returned previous transaction details.'
        });
        return;
      }
    }

    // 2. Perform transaction in secure ACID Session
    const result = await runInTransaction(async (session) => {
      // Find source account
      const sAccount = await Account.findOne({ accountNumber: sourceAccount }).session(session);
      if (!sAccount) {
        throw new Error('Source account not found');
      }

      // Check account frozen state
      if (sAccount.status !== 'active') {
        throw new Error('Source account is inactive or frozen');
      }

      // Check user blocked state
      const sUser = await User.findById(sAccount.user).session(session);
      if (!sUser || sUser.status !== 'active') {
        throw new Error('User associated with the source account is blocked or inactive');
      }

      // Check limits
      if (transferAmount < MIN_TRANSFER) {
        throw new Error(`Minimum transfer amount is ₹${MIN_TRANSFER}`);
      }
      if (transferAmount > MAX_TRANSFER) {
        throw new Error(`Maximum single transfer amount is ₹${MAX_TRANSFER.toLocaleString('en-IN')}`);
      }

      // Daily Limit check
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const dailySum = await Transaction.aggregate([
        {
          $match: {
            sourceAccount: sAccount._id,
            type: 'debit',
            status: 'completed',
            createdAt: { $gte: startOfDay }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ], session ? { session } : {});
      const dailyTotal = dailySum.length > 0 ? dailySum[0].total : 0;
      if (dailyTotal + transferAmount > DAILY_LIMIT) {
        throw new Error(`Daily transfer limit of ₹${DAILY_LIMIT.toLocaleString('en-IN')} exceeded. Current spent today: ₹${dailyTotal.toLocaleString('en-IN')}`);
      }

      // Monthly Limit check
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthlySum = await Transaction.aggregate([
        {
          $match: {
            sourceAccount: sAccount._id,
            type: 'debit',
            status: 'completed',
            createdAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ], session ? { session } : {});
      const monthlyTotal = monthlySum.length > 0 ? monthlySum[0].total : 0;
      if (monthlyTotal + transferAmount > MONTHLY_LIMIT) {
        throw new Error(`Monthly transfer limit of ₹${MONTHLY_LIMIT.toLocaleString('en-IN')} exceeded. Current spent this month: ₹${monthlyTotal.toLocaleString('en-IN')}`);
      }

      // Balance check
      if (sAccount.balance < transferAmount) {
        throw new Error('Insufficient balance');
      }

      const balanceBeforeSource = sAccount.balance;
      sAccount.balance -= transferAmount;
      await sAccount.save({ session });

      let targetAccId = null;
      let balanceBeforeTarget = 0;
      let balanceAfterTarget = 0;
      let isInternal = false;

      // Handle internal transfer
      if (transferType === 'Own Account Transfer' || transferType === 'Internal Transfer') {
        isInternal = true;
        const targetNumber = targetAccount || payeeAccount;
        const tAccount = await Account.findOne({ accountNumber: targetNumber }).session(session);
        if (!tAccount) {
          throw new Error('Target beneficiary account not found');
        }
        if (tAccount.status !== 'active') {
          throw new Error('Target beneficiary account is inactive or frozen');
        }

        const tUser = await User.findById(tAccount.user).session(session);
        if (!tUser || tUser.status !== 'active') {
          throw new Error('Target user account is blocked or inactive');
        }

        targetAccId = tAccount._id;
        balanceBeforeTarget = tAccount.balance;
        tAccount.balance += transferAmount;
        balanceAfterTarget = tAccount.balance;
        await tAccount.save({ session });

        // Notify target account holder
        await createNotification(
          tAccount.user.toString(),
          'Amount Credited',
          `₹${transferAmount.toLocaleString('en-IN')} has been credited to your account ${tAccount.accountNumber} from ${sAccount.accountNumber}.`,
          'transaction'
        );
      }

      const transactionId = generateReferenceId();

      const newTransaction = new Transaction({
        transactionId,
        sourceAccount: sAccount._id,
        targetAccount: targetAccId,
        type: 'debit',
        transferMode: transferType,
        amount: transferAmount,
        remarks,
        payeeName,
        payeeAccount,
        ifscCode,
        upiId,
        status: 'completed',
        idempotencyKey
      });
      await newTransaction.save({ session });

      // DOUBLE-ENTRY LEDGER WRITES
      // 1. Debit entry for source account
      const ledgerDebit = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: sAccount.accountNumber,
        type: 'debit',
        amount: transferAmount,
        balanceBefore: balanceBeforeSource,
        balanceAfter: sAccount.balance,
        remarks: remarks || `Debit transfer to ${payeeName || targetAccount}`,
        status: 'completed'
      });
      await ledgerDebit.save({ session });

      // 2. Credit entry for recipient or offset
      const creditAccount = isInternal && targetAccount ? targetAccount : (payeeAccount || 'EXTERNAL_ESCROW');
      const ledgerCredit = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: creditAccount,
        type: 'credit',
        amount: transferAmount,
        balanceBefore: isInternal ? balanceBeforeTarget : 0,
        balanceAfter: isInternal ? balanceAfterTarget : transferAmount,
        remarks: remarks || `Credit transfer from ${sAccount.accountNumber}`,
        status: 'completed'
      });
      await ledgerCredit.save({ session });

      // Notify sender
      await createNotification(
        sAccount.user.toString(),
        'Amount Debited',
        `₹${transferAmount.toLocaleString('en-IN')} has been debited from your account ${sAccount.accountNumber} for transfer to ${payeeName || 'external account'}.`,
        'transaction'
      );

      return {
        transactionId,
        transferType,
        amount: transferAmount,
        timestamp: newTransaction.createdAt,
        payeeName,
        payeeAccount,
        upiId
      };
    });

    res.status(201).json({
      success: true,
      transaction: result
    });

  } catch (error: any) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: error.message || 'Transaction failed' });
  }
};

export const depositMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber, amount, remarks } = req.body;
    const depositAmount = parseFloat(amount);

    if (!accountNumber || isNaN(depositAmount) || depositAmount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid input' });
      return;
    }

    const result = await runInTransaction(async (session) => {
      const account = await Account.findOne({ accountNumber }).session(session);
      if (!account) {
        throw new Error('Account not found');
      }

      if (account.status !== 'active') {
        throw new Error('Account is inactive or frozen');
      }

      const balanceBefore = account.balance;
      account.balance += depositAmount;
      await account.save({ session });

      const transactionId = generateReferenceId();

      const newTransaction = new Transaction({
        transactionId,
        sourceAccount: account._id,
        type: 'credit',
        transferMode: 'Deposit',
        amount: depositAmount,
        remarks: remarks || 'Cash Deposit',
        status: 'completed'
      });
      await newTransaction.save({ session });

      // DOUBLE-ENTRY LEDGER WRITES
      // 1. Credit entry for account
      const ledgerCredit = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: account.accountNumber,
        type: 'credit',
        amount: depositAmount,
        balanceBefore,
        balanceAfter: account.balance,
        remarks: remarks || 'Cash Deposit',
        status: 'completed'
      });
      await ledgerCredit.save({ session });

      // 2. Debit entry for Cash Vault (Offset)
      const ledgerDebitOffset = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: 'CASH_VAULT_OFFSET',
        type: 'debit',
        amount: depositAmount,
        balanceBefore: 0,
        balanceAfter: depositAmount,
        remarks: `Cash Deposit offset for account ${account.accountNumber}`,
        status: 'completed'
      });
      await ledgerDebitOffset.save({ session });

      // Notify depositor
      await createNotification(
        account.user.toString(),
        'Cash Deposited',
        `₹${depositAmount.toLocaleString('en-IN')} has been successfully deposited into your account ${account.accountNumber}.`,
        'transaction'
      );

      return newTransaction;
    });

    res.status(200).json({
      success: true,
      message: 'Deposit successful',
      transaction: result
    });
  } catch (error: any) {
    console.error('Deposit error:', error);
    res.status(500).json({ success: false, message: error.message || 'Deposit failed' });
  }
};

export const withdrawMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber, amount, remarks } = req.body;
    const withdrawAmount = parseFloat(amount);

    if (!accountNumber || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      res.status(400).json({ success: false, message: 'Invalid input' });
      return;
    }

    const result = await runInTransaction(async (session) => {
      const account = await Account.findOne({ accountNumber }).session(session);
      if (!account) {
        throw new Error('Account not found');
      }

      if (account.status !== 'active') {
        throw new Error('Account is inactive or frozen');
      }

      if (account.balance < withdrawAmount) {
        throw new Error('Insufficient balance');
      }

      const balanceBefore = account.balance;
      account.balance -= withdrawAmount;
      await account.save({ session });

      const transactionId = generateReferenceId();

      const newTransaction = new Transaction({
        transactionId,
        sourceAccount: account._id,
        type: 'debit',
        transferMode: 'Withdrawal',
        amount: withdrawAmount,
        remarks: remarks || 'Cash Withdrawal',
        status: 'completed'
      });
      await newTransaction.save({ session });

      // DOUBLE-ENTRY LEDGER WRITES
      // 1. Debit entry for account
      const ledgerDebit = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: account.accountNumber,
        type: 'debit',
        amount: withdrawAmount,
        balanceBefore,
        balanceAfter: account.balance,
        remarks: remarks || 'Cash Withdrawal',
        status: 'completed'
      });
      await ledgerDebit.save({ session });

      // 2. Credit entry for Cash Vault (Offset)
      const ledgerCreditOffset = new LedgerEntry({
        referenceNumber: transactionId,
        accountNumber: 'CASH_VAULT_OFFSET',
        type: 'credit',
        amount: withdrawAmount,
        balanceBefore: 0,
        balanceAfter: withdrawAmount,
        remarks: `Cash Withdrawal offset for account ${account.accountNumber}`,
        status: 'completed'
      });
      await ledgerCreditOffset.save({ session });

      // Notify user
      await createNotification(
        account.user.toString(),
        'Cash Withdrawn',
        `₹${withdrawAmount.toLocaleString('en-IN')} has been withdrawn from your account ${account.accountNumber}.`,
        'transaction'
      );

      return newTransaction;
    });

    res.status(200).json({
      success: true,
      message: 'Withdrawal successful',
      transaction: result
    });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    res.status(500).json({ success: false, message: error.message || 'Withdrawal failed' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;
    
    // Support filtering by account number if specified in query
    const query: any = {};
    if (req.query.accountNumber) {
      const acc = await Account.findOne({ accountNumber: String(req.query.accountNumber) });
      if (acc) {
        query.$or = [
          { sourceAccount: acc._id },
          { targetAccount: acc._id }
        ];
      }
    }

    const { getPaginatedResults } = await import('../utils/pagination');
    const paginated = await getPaginatedResults(
      Transaction,
      query,
      page,
      limit,
      { createdAt: -1 },
      [
        { path: 'sourceAccount', select: 'accountNumber user' },
        { path: 'targetAccount', select: 'accountNumber user' }
      ]
    );

    res.status(200).json(paginated);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};

export const getAccountHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      // If not in Account collection, try finding in CustomerAccount
      const ca = await CustomerAccount.findOne({ accountNumber });
      if (!ca) {
        res.status(404).json({ success: false, message: 'Account not found' });
        return;
      }
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const transactions = await Transaction.find({
      $or: [
        { sourceAccount: account._id },
        { targetAccount: account._id },
        { payeeAccount: accountNumber }
      ]
    })
      .populate('sourceAccount', 'accountNumber firstName lastName')
      .populate('targetAccount', 'accountNumber firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Fetch account history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction history' });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Transaction record deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete transaction' });
  }
};

export const clearAllTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    await Transaction.deleteMany({});
    res.status(200).json({ success: true, message: 'All transaction history cleared successfully' });
  } catch (error) {
    console.error('Clear transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear transaction history' });
  }
};

export const exportPDFStatement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountNumber, startDate, endDate } = req.query;
    
    if (!accountNumber) {
      res.status(400).json({ success: false, message: 'Account number is required' });
      return;
    }

    const account = await Account.findOne({ accountNumber: String(accountNumber) });
    if (!account) {
      res.status(404).json({ success: false, message: 'Account not found' });
      return;
    }

    // Resolve user
    let user = null;
    if (req.user?.id) {
      user = await User.findById(req.user.id);
    } else if (req.user?.customerId) {
      user = await User.findOne({ customerId: req.user.customerId });
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    // Verify ownership (unless admin)
    if (req.user?.role !== 'admin' && String(account.user) !== String(user._id)) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this account.' });
      return;
    }

    // Fetch transactions in range
    const start = startDate ? new Date(String(startDate) + 'T00:00:00.000Z') : new Date('2020-01-01');
    const end = endDate ? new Date(String(endDate) + 'T23:59:59.999Z') : new Date();

    const transactions = await Transaction.find({
      $or: [
        { sourceAccount: account._id },
        { targetAccount: account._id },
        { payeeAccount: String(accountNumber) }
      ],
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: 1 });

    const startStr = start.toLocaleDateString('en-IN', { dateStyle: 'medium' });
    const endStr = end.toLocaleDateString('en-IN', { dateStyle: 'medium' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=LomaX_Statement_${accountNumber}.pdf`);

    generatePDFStatement(account, user, transactions as any, startStr, endStr, res);
  } catch (error) {
    console.error('Export PDF error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate statement' });
    }
  }
};

export const exportCSVStatement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { accountNumber, startDate, endDate } = req.query;

    if (!accountNumber) {
      res.status(400).json({ success: false, message: 'Account number is required' });
      return;
    }

    const account = await Account.findOne({ accountNumber: String(accountNumber) });
    if (!account) {
      res.status(404).json({ success: false, message: 'Account not found' });
      return;
    }

    // Resolve user
    let user = null;
    if (req.user?.id) {
      user = await User.findById(req.user.id);
    } else if (req.user?.customerId) {
      user = await User.findOne({ customerId: req.user.customerId });
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    // Verify ownership
    if (req.user?.role !== 'admin' && String(account.user) !== String(user._id)) {
      res.status(403).json({ success: false, message: 'Forbidden. You do not own this account.' });
      return;
    }

    // Fetch transactions in range
    const start = startDate ? new Date(String(startDate) + 'T00:00:00.000Z') : new Date('2020-01-01');
    const end = endDate ? new Date(String(endDate) + 'T23:59:59.999Z') : new Date();

    const transactions = await Transaction.find({
      $or: [
        { sourceAccount: account._id },
        { targetAccount: account._id },
        { payeeAccount: String(accountNumber) }
      ],
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: 1 });

    const csvContent = generateCSVStatement(account, transactions as any);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=LomaX_Statement_${accountNumber}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate CSV' });
    }
  }
};

