/**
 * LomaX Platform — Full Database Seeder
 * Run: npx ts-node seed.ts
 *
 * Seeds: 10 branches, 20 employees, 100 customers, 100 accounts, 500+ transactions
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// ─── Models (inline schemas to avoid circular imports) ────────────────────
const UserSchema = new mongoose.Schema({
  customerId: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  pan: String,
  aadhaar: String,
  dob: String,
  gender: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  role: { type: String, default: 'customer' },
  isApproved: { type: Boolean, default: true },
  twoFactorEnabled: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  activeSessions: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  cifNumber: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountType: String,
  balance: { type: Number, default: 0 },
  branchName: String,
  branchCode: String,
  ifscCode: String,
  status: { type: String, default: 'active' },
  services: {
    debitCard: Boolean,
    internetBanking: Boolean,
    mobileBanking: Boolean,
    smsAlerts: Boolean,
    chequeBook: Boolean,
    upi: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
});

const BranchSchema = new mongoose.Schema({
  branchId: String,
  branchName: String,
  branchCode: { type: String, unique: true },
  ifscCode: String,
  micrCode: String,
  address: String,
  city: String,
  state: String,
  district: String,
  country: { type: String, default: 'India' },
  pincode: String,
  phone: String,
  email: String,
  managerName: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  sourceAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  targetAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  type: String,
  transferMode: String,
  amount: Number,
  remarks: String,
  payeeName: String,
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

const CustomerAccountSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  pan: String,
  aadhaar: String,
  plainPassword: { type: String, default: 'Password@123' },
  accountNumber: String,
  accountType: String,
  initialDeposit: Number,
  branchId: String,
  branchName: String,
  branchCode: String,
  ifscCode: String,
  services: {
    debitCard: { type: Boolean, default: true },
    internetBanking: { type: Boolean, default: true },
    mobileBanking: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    chequeBook: { type: Boolean, default: true },
    upi: { type: Boolean, default: true },
  },
  status: { type: String, default: 'approved' },
  approvedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  createdAt: { type: Date, default: Date.now },
});

const SeedUser = mongoose.model('User', UserSchema);
const SeedAccount = mongoose.model('Account', AccountSchema);
const SeedBranch = mongoose.model('Branch', BranchSchema);
const SeedTransaction = mongoose.model('Transaction', TransactionSchema);
const SeedCustomerAccount = mongoose.model('CustomerAccount', CustomerAccountSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const randAmount = () => Math.round(rand(500, 50000) * 100) / 100;
const uid = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const FIRST_NAMES = ['Arjun','Priya','Rahul','Neha','Amit','Divya','Vikram','Sneha','Karan','Pooja','Rohan','Ananya','Saurav','Meena','Deepak','Kavya','Rajesh','Simran','Aditya','Nisha'];
const LAST_NAMES  = ['Sharma','Patel','Singh','Verma','Kumar','Gupta','Joshi','Mehta','Shah','Mishra','Yadav','Nair','Reddy','Pandey','Das','Rao','Bose','Malhotra','Thakur','Iyer'];
const CITIES      = ['Mumbai','Delhi','Bengaluru','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad','Jaipur','Surat'];
const STATES      = ['Maharashtra','Delhi','Karnataka','Telangana','Maharashtra','Tamil Nadu','West Bengal','Gujarat','Rajasthan','Gujarat'];
const ACC_TYPES   = ['Savings Account','Current Account','Salary Account'];
const TXN_MODES   = ['NEFT','RTGS','IMPS','UPI','Internal Transfer'];
const REMARKS     = ['Monthly EMI','Online Shopping','Grocery Payment','Rent Transfer','Medical Bill','Utility Bill','Insurance Premium','Investment SIP','Education Fee','Travel Booking'];

const csvPath = path.join(__dirname, 'branchesData2.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
const records = lines.slice(1);

const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");

const BRANCHES = records.map(record => {
  const parts = record.split(',');
  if (parts.length < 10) return null;
  const [
    branchCode,
    branchName,
    ifscCode,
    micrCode,
    managerName,
    state,
    district,
    city,
    pincode,
    phone
  ] = parts;

  const country = "India";
  const address = city;
  const status = "Active";
  const email = `${formatStr(branchName)}.${formatStr(district)}.${formatStr(state)}.${formatStr(country)}@lomaxbank.com`;
  const branchId = `BID${branchCode.replace('BR', '')}`;

  return {
    branchId,
    branchCode,
    branchName,
    ifscCode,
    micrCode,
    address,
    city,
    state,
    district,
    country,
    pincode,
    phone,
    email,
    managerName,
    status
  };
}).filter(b => b !== null && b.branchCode && b.ifscCode) as any[];

// ─── Main seeder ──────────────────────────────────────────────────────────
async function seed() {
  let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lomax';
  console.log('\n🌱 LomaX Seeder — Connecting to MongoDB...');
  try {
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to preferred database\n');
  } catch (err: any) {
    console.warn('WARNING: Preferred connection failed. Details:', err.message || err);
    const fallbackURI = 'mongodb://localhost:27017/lomax';
    if (mongoURI !== fallbackURI) {
      console.log('Attempting fallback connection to local MongoDB:', fallbackURI);
      await mongoose.connect(fallbackURI);
      console.log('✓ Connected to fallback local MongoDB successfully!\n');
    } else {
      throw err;
    }
  }

  // Clear previous seed data
  await Promise.all([
    SeedUser.deleteMany({ role: 'customer' }),
    SeedAccount.deleteMany({}),
    SeedBranch.deleteMany({}),
    SeedTransaction.deleteMany({}),
    SeedCustomerAccount.deleteMany({}),
  ]);
  console.log('✓ Cleared existing seed data');

  // ── 1. Seed Branches ────────────────────────────────────────────────────
  const branches = await SeedBranch.insertMany(BRANCHES);
  console.log(`✓ Seeded ${branches.length} branches`);

  // ── 2. Seed 100 Customers + 100 Accounts ─────────────────────────────
  const hashedPw = await bcrypt.hash('Password@123', 10);
  const customerIds: string[] = [];
  const accountIds: mongoose.Types.ObjectId[] = [];
  const accountNumbers: string[] = [];

  for (let i = 1; i <= 100; i++) {
    const first = pick(FIRST_NAMES);
    const last  = pick(LAST_NAMES);
    const idx   = rand(0, branches.length - 1);
    const custId = `CUST${String(100000 + i).padStart(6, '0')}`;
    const accNum  = `${rand(1000000000, 9999999999)}`;
    const branch = branches[idx];

    const user = await new SeedUser({
      customerId: custId,
      firstName:  first,
      lastName:   last,
      email:      `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`,
      password:   hashedPw,
      mobile:     `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`,
      pan:        `${uid().slice(0,5)}${rand(1000,9999)}${uid().slice(0,1)}`,
      aadhaar:    String(rand(100000000000, 999999999999)),
      dob:        `${rand(1975, 2000)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`,
      gender:     pick(['Male','Female']),
      address:    `${rand(1,999)}, ${pick(['MG Road','Park Street','Lake View','Hill Side','Beach Road'])}`,
      city:       branch.city,
      state:      branch.state,
      pincode:    branch.pincode || String(400000 + rand(1, 99999)),
      role:       'customer',
      isApproved: true,
    }).save();
    const account = await new SeedAccount({
      accountNumber: accNum,
      cifNumber:     `CIF${rand(1000000, 9999999)}`,
      user:          user._id,
      accountType:   pick(ACC_TYPES),
      balance:       rand(5000, 500000),
      branchName:    branch.branchName,
      branchCode:    branch.branchCode,
      ifscCode:      branch.ifscCode,
      status:        'active',
      services: {
        debitCard:       true,
        internetBanking: true,
        mobileBanking:   true,
        smsAlerts:       true,
        chequeBook:      rand(0, 1) === 1,
        upi:             true,
      },
    }).save();

    await new SeedCustomerAccount({
      customerId: user.customerId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      pan: user.pan,
      aadhaar: user.aadhaar,
      plainPassword: 'Password@123',
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      initialDeposit: account.balance,
      branchId: branch.branchId,
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      ifscCode: branch.ifscCode,
      status: 'approved',
      userId: user._id,
      accountId: account._id,
      approvedAt: new Date(),
    }).save();

    customerIds.push(custId);
    accountIds.push(account._id as mongoose.Types.ObjectId);
    accountNumbers.push(accNum);

    if (i % 10 === 0) process.stdout.write(`  ✓ ${i}/100 customers\n`);
  }
  console.log(`✓ Seeded 100 customers + 100 accounts`);

  // ── 3. Seed 500 Transactions ─────────────────────────────────────────
  const txns = [];
  for (let i = 0; i < 500; i++) {
    const srcIdx = rand(0, 99);
    let tgtIdx   = rand(0, 99);
    while (tgtIdx === srcIdx) tgtIdx = rand(0, 99);

    const isCredit = rand(0, 1) === 1;
    const amount   = randAmount();

    // Randomise created date within last 6 months
    const daysAgo  = rand(0, 180);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    txns.push({
      transactionId:  `TXN${uid()}${uid()}`.slice(0, 15).toUpperCase(),
      sourceAccount:  accountIds[srcIdx],
      targetAccount:  accountIds[tgtIdx],
      type:           isCredit ? 'credit' : 'debit',
      transferMode:   pick(TXN_MODES),
      amount,
      remarks:        pick(REMARKS),
      payeeName:     `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      status:         'completed',
      createdAt,
    });
  }
  await SeedTransaction.insertMany(txns);
  console.log(`✓ Seeded 500 transactions`);

  console.log('\n🎉 Seeding complete! Summary:');
  console.log(`   Branches:     ${branches.length}`);
  console.log(`   Customers:   100`);
  console.log(`   Accounts:    100`);
  console.log(`   Transactions: 500`);
  console.log('\nDefault login for all seeded customers:');
  console.log('   Password: Password@123');
  console.log(`   First customer ID: ${customerIds[0]}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
