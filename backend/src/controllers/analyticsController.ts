import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import User from '../models/User';
import Budget from '../models/Budget';
import SavingsGoal from '../models/SavingsGoal';
import { Loan } from '../models/Loan';

// Categorization helper
export const getCategoryForTransaction = (tx: any): string => {
  if (tx.category) return tx.category;
  const text = `${tx.remarks || ''} ${tx.payeeName || ''} ${tx.transferMode || ''}`.toLowerCase();
  if (text.includes('zomato') || text.includes('swiggy') || text.includes('food') || text.includes('restaurant') || text.includes('cafe')) return 'Food';
  if (text.includes('uber') || text.includes('ola') || text.includes('travel') || text.includes('flight') || text.includes('train') || text.includes('irctc') || text.includes('fuel')) return 'Travel';
  if (text.includes('amazon') || text.includes('flipkart') || text.includes('shopping') || text.includes('myntra') || text.includes('mall') || text.includes('clothing')) return 'Shopping';
  if (text.includes('rent') || text.includes('bill') || text.includes('electricity') || text.includes('water') || text.includes('gas') || text.includes('recharge')) return 'Bills';
  if (text.includes('hospital') || text.includes('medical') || text.includes('doctor') || text.includes('pharmacy') || text.includes('health') || text.includes('lab')) return 'Healthcare';
  if (text.includes('netflix') || text.includes('prime') || text.includes('movie') || text.includes('spotify') || text.includes('entertainment') || text.includes('game')) return 'Entertainment';
  if (text.includes('mutual fund') || text.includes('stock') || text.includes('share') || text.includes('investment') || text.includes('sip') || text.includes('gold')) return 'Investment';
  if (text.includes('school') || text.includes('college') || text.includes('course') || text.includes('book') || text.includes('education') || text.includes('tution')) return 'Education';
  if (text.includes('insurance') || text.includes('lic') || text.includes('premium')) return 'Insurance';
  return 'Others';
};

export const getSmartAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    // Load user accounts
    const accounts = await Account.find({ user: user._id });
    const accountIds = accounts.map(a => a._id);
    const primaryAccount = accounts[0];

    // Load user transactions
    const txs = await Transaction.find({
      $or: [
        { sourceAccount: { $in: accountIds } },
        { targetAccount: { $in: accountIds } }
      ]
    }).sort({ createdAt: -1 });

    // 1. Smart spending classification
    const categorizedSpend: Record<string, number> = {};
    const monthlyTrend: Record<string, { credit: number; debit: number }> = {};
    const weeklyTrend: Record<string, { credit: number; debit: number }> = {};

    let totalCredits = 0;
    let totalDebits = 0;
    let largeTransactionsCount = 0;
    let recentTransfersIn24Hours = 0;
    const past24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    txs.forEach((tx: any) => {
      const category = getCategoryForTransaction(tx);
      const isSourceOwner = accountIds.some(id => id.toString() === tx.sourceAccount?.toString());
      
      const date = new Date(tx.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // Calculate weekly key (format: W1, W2, etc.)
      const weekNum = Math.ceil(date.getDate() / 7);
      const weekKey = `Week ${weekNum}`;

      if (!monthlyTrend[monthKey]) monthlyTrend[monthKey] = { credit: 0, debit: 0 };
      if (!weeklyTrend[weekKey]) weeklyTrend[weekKey] = { credit: 0, debit: 0 };

      // Map credits vs debits
      if (tx.type === 'debit' && isSourceOwner) {
        totalDebits += tx.amount;
        categorizedSpend[category] = (categorizedSpend[category] || 0) + tx.amount;
        monthlyTrend[monthKey].debit += tx.amount;
        weeklyTrend[weekKey].debit += tx.amount;

        if (tx.amount >= 50000) largeTransactionsCount++;
        if (date > past24h) recentTransfersIn24Hours++;
      } else {
        totalCredits += tx.amount;
        monthlyTrend[monthKey].credit += tx.amount;
        weeklyTrend[weekKey].credit += tx.amount;
      }
    });

    // 2. Financial Health Score calculation
    let healthScore = 75;
    const healthFindings: string[] = [];

    // Savings ratio
    const savingsRatio = totalCredits > 0 ? ((totalCredits - totalDebits) / totalCredits) * 100 : 0;
    if (savingsRatio >= 30) {
      healthScore += 15;
      healthFindings.push('✓ Healthy savings ratio');
    } else if (savingsRatio >= 10) {
      healthScore += 5;
      healthFindings.push('✓ Moderate savings ratio');
    } else {
      healthScore -= 10;
      healthFindings.push('✗ Low savings ratio (spending exceeds recommendations)');
    }

    // Loans
    const userLoans = await Loan.find({ user: user._id });
    const overdueLoans = userLoans.filter((l: any) => l.status === 'approved' && (l.remarks || '').toLowerCase().includes('overdue'));
    if (overdueLoans.length === 0) {
      healthScore += 10;
      healthFindings.push('✓ No overdue loans');
    } else {
      healthScore -= 20;
      healthFindings.push('✗ Overdue loan burden detected');
    }

    // Transaction consistency
    if (txs.length >= 8) {
      healthScore += 5;
      healthFindings.push('✓ Active account transactions');
    }

    healthScore = Math.max(0, Math.min(100, healthScore));
    let healthStatus = 'Fair';
    if (healthScore >= 85) healthStatus = 'Excellent';
    else if (healthScore >= 70) healthStatus = 'Good';
    else if (healthScore >= 50) healthStatus = 'Fair';
    else healthStatus = 'Critical';

    // 3. Risk Score calculation
    let riskScore = 10;
    if (user.failedLoginAttempts > 0) riskScore += user.failedLoginAttempts * 10;
    if (largeTransactionsCount > 0) riskScore += largeTransactionsCount * 15;
    if (recentTransfersIn24Hours >= 3) riskScore += 20;

    riskScore = Math.max(0, Math.min(100, riskScore));
    let riskLabel = 'Low';
    if (riskScore >= 75) riskLabel = 'Critical';
    else if (riskScore >= 50) riskLabel = 'High';
    else if (riskScore >= 25) riskLabel = 'Medium';
    else riskLabel = 'Low';

    // 4. Banking Insights
    const insights: string[] = [];
    
    // Top category
    let topCategory = 'None';
    let maxCategoryAmt = 0;
    Object.entries(categorizedSpend).forEach(([cat, amt]) => {
      if (amt > maxCategoryAmt) {
        maxCategoryAmt = amt;
        topCategory = cat;
      }
    });

    if (topCategory !== 'None') {
      insights.push(`Shopping is your top spending category (₹${maxCategoryAmt.toLocaleString()}). Avoid non-essential spends to stay on budget.`);
    }

    if (savingsRatio < 10) {
      insights.push('You spent more than 90% of your earnings this month. Try putting at least 15% into savings goals.');
    } else {
      insights.push('Great job! Your savings ratio is in the target zone. Continue to fund active savings goals.');
    }

    // 5. Predictive Balance Calculator
    const currentBalance = primaryAccount ? primaryAccount.balance : 0;
    const weeklySpendAvg = txs.length > 0 ? (totalDebits / 4) : 2000;
    const predictedBalance = Math.max(0, currentBalance - (weeklySpendAvg * 4) + (totalCredits / 4));

    res.json({
      success: true,
      analytics: {
        financialHealth: {
          score: healthScore,
          status: healthStatus,
          findings: healthFindings
        },
        riskDashboard: {
          score: riskScore,
          label: riskLabel
        },
        spendingCategories: Object.entries(categorizedSpend).map(([name, value]) => ({ name, value })),
        trends: {
          monthly: Object.entries(monthlyTrend).map(([month, val]) => ({ month, ...val })),
          weekly: Object.entries(weeklyTrend).map(([week, val]) => ({ week, ...val }))
        },
        insights,
        predictiveBalance: {
          current: currentBalance,
          weeklySpendAvg,
          predicted: predictedBalance
        }
      }
    });

  } catch (error: any) {
    console.error('Analytics execution failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// BUDGET ENDPOINTS
export const getBudgets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const date = new Date();
    const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Get limits
    const budgets = await Budget.find({ user: user._id, month: currentMonth });

    // Fetch accounts to calculate live spent
    const accounts = await Account.find({ user: user._id });
    const accountIds = accounts.map(a => a._id);

    // Sum transactions in current month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const txs = await Transaction.find({
      sourceAccount: { $in: accountIds },
      type: 'debit',
      createdAt: { $gte: startOfMonth }
    });

    const categorySpend: Record<string, number> = {};
    txs.forEach((tx: any) => {
      const cat = getCategoryForTransaction(tx);
      categorySpend[cat] = (categorySpend[cat] || 0) + tx.amount;
    });

    // Merge limit values with live spending
    const result = budgets.map(b => {
      const spent = categorySpend[b.category] || 0;
      return {
        _id: b._id,
        category: b.category,
        limitAmount: b.limitAmount,
        spentAmount: spent,
        month: b.month
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get budgets failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const setBudget = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { category, limitAmount } = req.body;

    if (!category || !limitAmount) {
      res.status(400).json({ success: false, message: 'Category and limitAmount are required.' });
      return;
    }

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const date = new Date();
    const currentMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const updated = await Budget.findOneAndUpdate(
      { user: user._id, category, month: currentMonth },
      { limitAmount: parseFloat(limitAmount) },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated, message: 'Budget limit configured successfully.' });
  } catch (error) {
    console.error('Configure budget failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SAVINGS GOAL ENDPOINTS
export const getSavingsGoals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const goals = await SavingsGoal.find({ user: user._id });
    res.json({ success: true, data: goals });
  } catch (error) {
    console.error('Get savings goals failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSavingsGoal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { title, targetAmount, targetDate, category } = req.body;

    if (!title || !targetAmount) {
      res.status(400).json({ success: false, message: 'Goal title and target amount are required.' });
      return;
    }

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const newGoal = new SavingsGoal({
      user: user._id,
      title,
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      category: category || 'General',
      currentAmount: 0
    });

    await newGoal.save();
    res.status(201).json({ success: true, data: newGoal, message: 'Savings goal initialized successfully.' });
  } catch (error) {
    console.error('Create savings goal failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addSavingsGoalDeposit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?.customerId;
    const { goalId, amount, sourceAccountNumber } = req.body;

    const depositAmount = parseFloat(amount);
    if (!goalId || isNaN(depositAmount) || depositAmount <= 0 || !sourceAccountNumber) {
      res.status(400).json({ success: false, message: 'Invalid deposit values.' });
      return;
    }

    const user = await User.findOne({ customerId });
    if (!user) {
      res.status(404).json({ success: false, message: 'User context not found.' });
      return;
    }

    const sourceAccount = await Account.findOne({ accountNumber: sourceAccountNumber, user: user._id });
    if (!sourceAccount) {
      res.status(403).json({ success: false, message: 'Unauthorized. You do not own the source account.' });
      return;
    }

    if (sourceAccount.balance < depositAmount) {
      res.status(400).json({ success: false, message: 'Insufficient balance to fund this goal.' });
      return;
    }

    const goal = await SavingsGoal.findOne({ _id: goalId, user: user._id });
    if (!goal) {
      res.status(404).json({ success: false, message: 'Savings goal not found.' });
      return;
    }

    // Deduct from account
    sourceAccount.balance -= depositAmount;
    await sourceAccount.save();

    // Add to goal
    goal.currentAmount += depositAmount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'achieved';
    }
    await goal.save();

    // Create Transaction Record
    const transactionId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
    const newTransaction = new Transaction({
      transactionId,
      sourceAccount: sourceAccount._id,
      type: 'debit',
      transferMode: 'Own Account Transfer',
      amount: depositAmount,
      remarks: `Goal Deposit: ${goal.title}`,
      payeeName: `Savings Goal: ${goal.title}`,
      status: 'completed'
    });
    await newTransaction.save();

    res.json({ 
      success: true, 
      goal, 
      accountBalance: sourceAccount.balance, 
      message: `Successfully deposited ₹${depositAmount} towards ${goal.title}!` 
    });
  } catch (error) {
    console.error('Goal deposit failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN FRAUD ENGINE STATS
export const getAdminFraudStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Audit check on user role
    const customerId = req.user?.customerId;
    const user = await User.findOne({ customerId });
    if (!user || user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
      return;
    }

    // Find all active accounts
    const allAccounts = await Account.find().populate('user', 'firstName lastName failedLoginAttempts customerId');
    
    // Find all users
    const allUsers = await User.find();

    // Calculate fraud metrics dynamically
    let totalRiskScore = 0;
    let criticalThreatsCount = 0;
    let highThreatsCount = 0;
    const recentLargeTxs = await Transaction.find({ amount: { $gte: 50000 }, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

    const riskBreakdown = allUsers.map((u: any) => {
      let risk = 10;
      if (u.failedLoginAttempts > 0) risk += u.failedLoginAttempts * 10;
      
      // Large transactions check
      const largeTxCount = recentLargeTxs.filter(t => t.payeeName?.includes(u.firstName) || t.remarks?.includes(u.customerId)).length;
      risk += largeTxCount * 15;

      risk = Math.max(0, Math.min(100, risk));
      totalRiskScore += risk;

      if (risk >= 75) criticalThreatsCount++;
      else if (risk >= 50) highThreatsCount++;

      return {
        customerId: u.customerId,
        name: `${u.firstName} ${u.lastName}`,
        riskScore: risk,
        failedLogins: u.failedLoginAttempts,
        status: risk >= 75 ? 'Critical' : risk >= 50 ? 'High' : risk >= 25 ? 'Medium' : 'Low'
      };
    });

    const averageRisk = allUsers.length > 0 ? (totalRiskScore / allUsers.length) : 0;

    res.json({
      success: true,
      stats: {
        averageRisk,
        criticalThreatsCount,
        highThreatsCount,
        largeTransactionsCount: recentLargeTxs.length,
        riskBreakdown
      }
    });

  } catch (error) {
    console.error('Get fraud stats failed:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
