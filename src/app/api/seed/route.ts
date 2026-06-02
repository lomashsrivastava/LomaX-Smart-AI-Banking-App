import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import Card from '@/models/Card';
import Goal from '@/models/Goal';
import UpiMandate from '@/models/UpiMandate';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing
    await User.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    await Card.deleteMany({});

    // 1. Create User
    const user = await User.create({
      email: 'aanya@lomax.neo',
      phone: '+919876543210',
      fullName: 'Aanya Sharma',
      kycStatus: 'verified',
      trustScore: 850,
    });

    // 2. Create Accounts
    const accounts = await Account.insertMany([
      { userId: user._id, accountType: 'savings', accountNumber: '****4521', ifscCode: 'LMAX0001', balance: 245000, currency: 'INR', color: '#00e5ff' },
      { userId: user._id, accountType: 'current', accountNumber: '****7832', ifscCode: 'LMAX0001', balance: 89500, currency: 'INR', color: '#b900ff' },
      { userId: user._id, accountType: 'business', accountNumber: '****1290', ifscCode: 'LMAX0002', balance: 1250000, currency: 'INR', color: '#ff007f' },
      { userId: user._id, accountType: 'premium', accountNumber: '****9988', ifscCode: 'LMAX0001', balance: 5420000, currency: 'INR', color: '#10b981' },
    ]);

    // 3. Create Transactions
    const categories = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills & Utilities', 'Health', 'Education', 'Investment', 'Salary', 'Freelance', 'Refund', 'Transfer'];
    const merchants = ['Zomato', 'Amazon', 'Uber', 'Netflix', 'Airtel', 'Apollo Pharmacy', 'Coursera', 'Groww', 'TechCorp Inc', 'DesignStudio', 'Flipkart', 'Swiggy'];
    
    const txnsToInsert = [];
    for (let i = 0; i < 50; i++) {
      const isCredit = Math.random() > 0.6;
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      const amt = isCredit ? Math.floor(Math.random() * 100000) + 5000 : Math.floor(Math.random() * 15000) + 100;
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 60));
      
      txnsToInsert.push({
        fromAccountId: isCredit ? 'ext_employer' : String(accounts[0]._id),
        toAccountId: isCredit ? String(accounts[0]._id) : 'ext_merchant',
        amount: amt,
        currency: 'INR',
        timestamp: d,
        status: 'completed',
        type: isCredit ? 'credit' : 'debit',
        aiNarrative: isCredit ? `Received ₹${amt.toLocaleString()} from ${merchant}` : `Paid ₹${amt.toLocaleString()} to ${merchant} for ${cat}`,
        riskScore: Math.floor(Math.random() * 200),
        fraudDecision: 'allow',
        merchantName: merchant,
        category: cat,
        signature: `dilithium-sig-${Math.random().toString(36).slice(2, 10)}`,
      });
    }
    await Transaction.insertMany(txnsToInsert);

    // 4. Create Cards
    await Card.insertMany([
      { userId: user._id, cardType: 'physical', cardNetwork: 'visa', lastFour: '4521', expiryMonth: 12, expiryYear: 2028, status: 'active', currentCvv: '738', designTheme: 'galaxy-nebula' },
      { userId: user._id, cardType: 'virtual', cardNetwork: 'mastercard', lastFour: '8899', expiryMonth: 6, expiryYear: 2027, status: 'active', currentCvv: '412', onlineEnabled: true, internationalEnabled: true, nightLockEnabled: true, designTheme: 'aurora-wave' },
      { userId: user._id, cardType: 'physical', cardNetwork: 'rupay', lastFour: '3367', expiryMonth: 3, expiryYear: 2029, status: 'frozen', currentCvv: '---', onlineEnabled: false, internationalEnabled: false, designTheme: 'deep-space' },
    ]);

    // 5. Create Goals
    
    await Goal.deleteMany({});
    await UpiMandate.deleteMany({});

    await Goal.insertMany([
      { userId: user._id, name: 'Europe Trip 2026', targetAmount: 500000, currentAmount: 325000, deadline: new Date('2026-12-31'), priority: 1, status: 'active', color: '#00e5ff', aiStrategy: 'Save ₹12,500/month', predictedCompletionDate: new Date('2026-10-15') },
      { userId: user._id, name: 'Emergency Fund', targetAmount: 600000, currentAmount: 480000, priority: 2, status: 'active', color: '#10b981', aiStrategy: 'Auto-transfer ₹15,000/month', predictedCompletionDate: new Date('2026-04-01') },
    ]);

    // 6. Create UPI Mandates
    await UpiMandate.insertMany([
      { userId: user._id, merchantName: 'Netflix', merchantUpiId: 'netflix@axl', accountId: accounts[0]._id, maxAmount: 799, frequency: 'monthly', status: 'active', nextDebitDate: new Date('2026-07-05'), aiInsights: 'Usually debited on 5th' },
      { userId: user._id, merchantName: 'Zerodha Mutual Funds', merchantUpiId: 'zerodha@hdfcbank', accountId: accounts[0]._id, maxAmount: 25000, frequency: 'monthly', status: 'active', nextDebitDate: new Date('2026-06-10'), aiInsights: 'SIP investment' },
    ]);

    return NextResponse.json({ success: true, message: 'Database seeded successfully', userId: user._id });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
