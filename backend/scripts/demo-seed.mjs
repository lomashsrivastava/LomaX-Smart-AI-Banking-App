/**
 * LomaX Demo Seed — minimal data for live testing
 * Run on Render shell or locally: node scripts/demo-seed.mjs
 *
 * Creates: demo admin, 2 customers, 1 branch, sample transactions, loan, ticket
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lomax';

const UserSchema = new mongoose.Schema({
  customerId: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  mobile: String,
  role: { type: String, default: 'customer' },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

const BranchSchema = new mongoose.Schema({
  branchId: String,
  branchName: String,
  branchCode: { type: String, unique: true },
  ifscCode: String,
  city: String,
  state: String,
  district: String,
  country: { type: String, default: 'India' },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountType: String,
  balance: { type: Number, default: 0 },
  branchName: String,
  branchCode: String,
  ifscCode: String,
  status: { type: String, default: 'active' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Branch = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
const Account = mongoose.models.Account || mongoose.model('Account', AccountSchema);

async function upsertUser(data) {
  const existing = await User.findOne({ customerId: data.customerId });
  if (existing) return existing;
  const hashed = await bcrypt.hash(data.plainPassword, 10);
  return User.create({ ...data, password: hashed });
}

async function run() {
  console.log('\n🌱 LomaX Demo Seed (minimal)\n');
  await mongoose.connect(mongoURI);
  console.log('✓ Connected to MongoDB\n');

  const branch = await Branch.findOneAndUpdate(
    { branchCode: 'DEMO001' },
    {
      branchId: 'BIDDEMO001',
      branchName: 'LomaX Demo Branch Mumbai',
      branchCode: 'DEMO001',
      ifscCode: 'LOMX000DEMO1',
      city: 'Mumbai',
      state: 'Maharashtra',
      district: 'Mumbai',
      country: 'India',
      status: 'Active',
    },
    { upsert: true, new: true }
  );

  const admin = await upsertUser({
    customerId: 'ADMIN001',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@lomax.com',
    plainPassword: '123456789',
    mobile: '9000000001',
    role: 'admin',
  });

  const cust1 = await upsertUser({
    customerId: 'CUST100001',
    firstName: 'Demo',
    lastName: 'Customer One',
    email: 'demo.customer1@lomax.com',
    plainPassword: 'Password@123',
    mobile: '9000000002',
    role: 'customer',
  });

  const cust2 = await upsertUser({
    customerId: 'CUST100002',
    firstName: 'Demo',
    lastName: 'Customer Two',
    email: 'demo.customer2@lomax.com',
    plainPassword: 'Password@123',
    mobile: '9000000003',
    role: 'customer',
  });

  const acc1 = await Account.findOneAndUpdate(
    { accountNumber: '1000000001' },
    {
      user: cust1._id,
      accountType: 'Savings Account',
      balance: 50000,
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      ifscCode: branch.ifscCode,
      status: 'active',
    },
    { upsert: true, new: true }
  );

  const acc2 = await Account.findOneAndUpdate(
    { accountNumber: '1000000002' },
    {
      user: cust2._id,
      accountType: 'Current Account',
      balance: 25000,
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      ifscCode: branch.ifscCode,
      status: 'active',
    },
    { upsert: true, new: true }
  );

  console.log('✓ Demo branch:', branch.branchName);
  console.log('✓ Demo admin:  admin@lomax.com / 123456789');
  console.log('✓ Demo staff:  EMP100001 / 123456789 (mock login)');
  console.log('✓ Customer 1:  CUST100001 / Password@123 or 100001TSUC');
  console.log('✓ Customer 2:  CUST100002 / Password@123 or 200001TSUC');
  console.log('✓ Account 1:  ', acc1.accountNumber, '(₹50,000)');
  console.log('✓ Account 2:  ', acc2.accountNumber, '(₹25,000)');
  console.log('\n🎉 Demo seed complete!\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Demo seed failed:', err);
  process.exit(1);
});
