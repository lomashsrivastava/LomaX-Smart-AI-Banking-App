import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

import User from '../models/User';
import Account from '../models/Account';
import { Branch } from '../models/Branch';
import Transaction from '../models/Transaction';
import CustomerAccount from '../models/CustomerAccount';
import Employee from '../models/Employee';
import { Loan } from '../models/Loan';
import { Ticket } from '../models/Ticket';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const randAmount = () => Math.round(rand(500, 50000) * 100) / 100;
const uid = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const FIRST_NAMES = ['Arjun','Priya','Rahul','Neha','Amit','Divya','Vikram','Sneha','Karan','Pooja','Rohan','Ananya','Saurav','Meena','Deepak','Kavya','Rajesh','Simran','Aditya','Nisha'];
const LAST_NAMES  = ['Sharma','Patel','Singh','Verma','Kumar','Gupta','Joshi','Mehta','Shah','Mishra','Yadav','Nair','Reddy','Pandey','Das','Rao','Bose','Malhotra','Thakur','Iyer'];
const ACC_TYPES   = ['Savings Account','Current Account','Salary Account'];
const TXN_MODES   = ['NEFT','RTGS','IMPS','UPI','Internal Transfer'];
const REMARKS     = ['Monthly EMI','Online Shopping','Grocery Payment','Rent Transfer','Medical Bill','Utility Bill','Insurance Premium','Investment SIP','Education Fee','Travel Booking'];

const getCSVPath = () => {
  const paths = [
    path.join(process.cwd(), 'branchesData2.csv'),
    path.join(process.cwd(), '..', 'branchesData2.csv'),
    path.join(__dirname, 'branchesData2.csv'),
    path.join(__dirname, '..', 'branchesData2.csv'),
    path.join(__dirname, '..', '..', 'branchesData2.csv'),
    path.join(__dirname, '..', '..', '..', 'branchesData2.csv'),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  throw new Error('branchesData2.csv not found');
};

const formatStr = (str: string) => str.trim().toLowerCase().replace(/\s+/g, "");

export async function seedDatabase() {
  const csvPath = getCSVPath();
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const records = lines.slice(1);

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

  // Clear previous data
  await Promise.all([
    User.deleteMany({}),
    Account.deleteMany({}),
    Branch.deleteMany({}),
    Transaction.deleteMany({}),
    CustomerAccount.deleteMany({}),
    Employee.deleteMany({}),
    Loan.deleteMany({}),
    Ticket.deleteMany({}),
  ]);

  // Seed Branches
  const branches = await Branch.insertMany(BRANCHES);

  // Passwords
  const hashedPw = await bcrypt.hash('Password@123', 10);
  const adminHashedPw = await bcrypt.hash('123456789', 10);
  const staffHashedPw = await bcrypt.hash('123456789', 10);


  const customerIds: string[] = [];
  const accountIds: mongoose.Types.ObjectId[] = [];
  const accountNumbers: string[] = [];

  // Seed 100 Customers + 100 Accounts (90 approved, 10 pending)
  for (let i = 1; i <= 100; i++) {
    const first = pick(FIRST_NAMES);
    const last  = pick(LAST_NAMES);
    const idx   = rand(0, branches.length - 1);
    const custId = `CUST${String(100000 + i).padStart(6, '0')}`;
    const accNum  = `${rand(1000000000, 9999999999)}`;
    const branch = branches[idx];

    const isPending = i > 90;

    if (isPending) {
      // Seed pending application (no User or Account created yet)
      await new CustomerAccount({
        customerId: custId,
        firstName: first,
        lastName: last,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`,
        mobile: `${rand(1, 9)}${String(rand(0, 999999999)).padStart(9, '0')}`,
        pan: `${uid().slice(0,5)}${rand(1000,9999)}${uid().slice(0,1)}`,
        aadhaar: String(rand(100000000000, 999999999999)),
        plainPassword: 'Password@123',
        accountNumber: accNum,
        accountType: pick(ACC_TYPES),
        initialDeposit: rand(5000, 500000),
        branchId: branch.branchId,
        branchName: branch.branchName,
        branchCode: branch.branchCode,
        ifscCode: branch.ifscCode,
        status: 'pending',
        services: {
          debitCard: true,
          internetBanking: true,
          mobileBanking: true,
          smsAlerts: true,
          chequeBook: rand(0, 1) === 1,
          upi: true,
        },
      }).save();
    } else {
      const user = await new User({
        customerId: custId,
        firstName:  first,
        lastName:   last,
        email:      `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`,
        password:   hashedPw,
        mobile:     `${rand(1, 9)}${String(rand(0, 999999999)).padStart(9, '0')}`,
        pan:        `${uid().slice(0,5)}${rand(1000,9999)}${uid().slice(0,1)}`,
        aadhaar:    String(rand(100000000000, 999999999999)),
        dob:        `${rand(1975, 2000)}-${String(rand(1,12)).padStart(2,'0')}-${String(rand(1,28)).padStart(2,'0')}`,
        gender:     pick(['Male','Female']),
        address:    `${rand(1,999)}, ${pick(['MG Road','Park Street','Lake View','Hill Side','Beach Road'])}`,
        city:       branch.city,
        state:      branch.state,
        pincode:    branch.pincode || String(400000 + rand(1, 99999)),
        role:       'customer',
        status:     'active',
      }).save();

      const account = await new Account({
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

      await new CustomerAccount({
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
    }
  }

  // Seed Transactions
  const txns = [];
  const maxIdx = accountIds.length - 1;
  for (let i = 0; i < 500; i++) {
    const srcIdx = rand(0, maxIdx);
    let tgtIdx   = rand(0, maxIdx);
    while (tgtIdx === srcIdx && maxIdx > 0) tgtIdx = rand(0, maxIdx);

    const isCredit = rand(0, 1) === 1;
    const amount   = randAmount();
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
  await Transaction.insertMany(txns);

  // Seed Employees
  const employeesData = [];
  const firstBranch = branches[0];
  const vivekEmail = 'emp@lomax.com';
  const vivekEmp = await new Employee({
    empId: 'EMP100001',
    firstName: 'Vivek',
    lastName: 'Singh',
    gender: 'Male',
    phone: '9876543210',
    email: 'vivek.singh@gmail.com',
    state: firstBranch.state,
    district: firstBranch.district,
    status: 'Active',
    role: 'Cashier',
    officialEmail: vivekEmail,
    password: staffHashedPw,
    branchId: firstBranch._id,
    department: 'Operations'
  }).save();
  employeesData.push(vivekEmp);

  const EMP_ROLES = ['Manager', 'Cashier', 'Officer', 'Clerk'];
  const EMP_DEPTS = ['Retail Banking', 'Operations', 'Loans', 'Customer Service'];

  for (let i = 2; i <= 30; i++) {
    const first = pick(FIRST_NAMES);
    const last  = pick(LAST_NAMES);
    const idx   = rand(0, branches.length - 1);
    const branch = branches[idx];
    const empId = `EMP${String(100000 + i).padStart(6, '0')}`;
    
    const fName = first.toLowerCase().replace(/\s+/g, "");
    const lName = last.toLowerCase().replace(/\s+/g, "");
    const bName = branch.branchName.toLowerCase().replace(/\s+/g, "");
    const dist = branch.district.toLowerCase().replace(/\s+/g, "");
    const st = branch.state.toLowerCase().replace(/\s+/g, "");
    const officialEmail = `${fName}${lName}.staff.${bName}.${dist}.${st}.india@lomaxbank.com`;

    const emp = await new Employee({
      empId,
      firstName: first,
      lastName: last,
      gender: pick(['Male', 'Female']),
      phone: `${rand(1, 9)}${String(rand(0, 999999999)).padStart(9, '0')}`,
      email: `${fName}.${lName}${i}@gmail.com`,
      state: branch.state,
      district: branch.district,
      status: 'Active',
      role: pick(EMP_ROLES),
      officialEmail,
      password: hashedPw,
      branchId: branch._id,
      department: pick(EMP_DEPTS)
    }).save();
    employeesData.push(emp);
  }

  // Seed Loans
  const loansData = [];
  const LOAN_TYPES = ['Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan'];
  const LOAN_STATUSES = ['Pending', 'Approved', 'Rejected', 'Active', 'Closed'];
  const PURPOSES = ['Buying a house', 'Medical bills', 'New car purchase', 'Higher education studies', 'Home renovation'];

  for (let i = 1; i <= 20; i++) {
    const custId = pick(customerIds);
    const appliedAt = new Date(Date.now() - rand(1, 90) * 86400000);
    const status = pick(LOAN_STATUSES);
    const approvedAt = (status === 'Approved' || status === 'Active' || status === 'Closed') 
      ? new Date(appliedAt.getTime() + rand(1, 10) * 86400000) 
      : undefined;

    loansData.push({
      applicationId: `LAPP${rand(100000, 999999)}`,
      customerId: custId,
      loanType: pick(LOAN_TYPES),
      amount: rand(50000, 2000000),
      tenureMonths: pick([12, 24, 36, 48, 60, 120]),
      interestRate: pick([7.5, 8.5, 9.2, 10.5, 12.0]),
      purpose: pick(PURPOSES),
      monthlyIncome: rand(25000, 250000),
      status,
      appliedAt,
      approvedAt
    });
  }
  await Loan.insertMany(loansData);

  // Seed Tickets
  const ticketsData = [];
  const TICKET_SUBJECTS = [
    'Transfer failed but amount debited', 
    'ATM card blocked', 
    'Profile phone number update', 
    'Unable to login to internet banking', 
    'Apply for checkbook', 
    'Double deduction on transaction'
  ];
  const TICKET_CATEGORIES = ['Transaction Issue', 'Card Services', 'Profile Update', 'Access Issue', 'General Query'];
  const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
  const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

  for (let i = 1; i <= 20; i++) {
    const custId = pick(customerIds);
    const assignedEmp = pick(employeesData);
    
    ticketsData.push({
      ticketId: `TKT${rand(100000, 999999)}`,
      customerId: custId,
      subject: pick(TICKET_SUBJECTS),
      category: pick(TICKET_CATEGORIES),
      priority: pick(TICKET_PRIORITIES),
      status: pick(TICKET_STATUSES),
      description: 'This is an automatically generated support ticket. Please assist with this issue as soon as possible.',
      assignedTo: assignedEmp.empId
    });
  }
  await Ticket.insertMany(ticketsData);

  return {
    branchesCount: branches.length,
    employeesCount: employeesData.length,
    customersCount: 100,
    accountsCount: 100,
    transactionsCount: 500,
    loansCount: loansData.length,
    ticketsCount: ticketsData.length,
  };
}
