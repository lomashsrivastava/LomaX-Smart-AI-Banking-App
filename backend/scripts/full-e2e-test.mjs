/**
 * LomaX Full E2E API Test Suite
 * Run: node scripts/full-e2e-test.mjs
 */

const BASE = process.env.API_URL || 'http://localhost:5000/api';
const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: 'PASS' });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.log(`  ❌ ${name} — ${err.message}`);
  }
}

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let adminToken, customerToken, customerId, accountNumber, branchId, pendingId, loanId, ticketId;

async function run() {
  console.log('\n🧪 LomaX Full E2E Test Suite');
  console.log(`   API: ${BASE}\n`);

  // ── Health ──────────────────────────────────────────────────────────────
  console.log('── System ──');
  await test('Health check', async () => {
    const { status, data } = await req('GET', '/health');
    assert(status === 200 && data.status === 'ok', `Health failed: ${status}`);
  });

  // ── Auth: Admin ─────────────────────────────────────────────────────────
  console.log('\n── Authentication ──');
  await test('Admin login (admin@lomax.com)', async () => {
    const { status, data } = await req('POST', '/auth/login', {
      customerId: 'admin@lomax.com',
      password: '123456789',
    });
    assert(status === 200 && data.success, data.message || 'Admin login failed');
    adminToken = data.token;
  });

  await test('Staff login (EMP100001)', async () => {
    const { status, data } = await req('POST', '/auth/login', {
      customerId: 'EMP100001',
      password: '123456789',
    });
    assert(status === 200 && data.success, data.message || 'Staff login failed');
  });

  await test('Customer login (CUST100001)', async () => {
    const { status, data } = await req('POST', '/auth/login', {
      customerId: 'CUST100001',
      password: '100001TSUC',
    });
    assert(status === 200 && data.success, data.message || 'Customer login failed');
    customerToken = data.token;
    customerId = 'CUST100001';
  });

  // ── Dashboard ───────────────────────────────────────────────────────────
  console.log('\n── Admin Dashboard ──');
  await test('Dashboard stats', async () => {
    const { status, data } = await req('GET', '/dashboard/stats');
    assert(status === 200 && data.success !== false, 'Dashboard stats failed');
  });

  // ── Branches ────────────────────────────────────────────────────────────
  console.log('\n── Branch Management ──');
  await test('List branch regions', async () => {
    const { status, data } = await req('GET', '/branches/regions');
    assert(status === 200 && data.regions, 'Regions failed');
  });

  await test('List branches', async () => {
    const { status, data } = await req('GET', '/branches');
    assert(status === 200 && Array.isArray(data.data) && data.data.length > 0, 'No branches');
    branchId = data.data[0]._id;
  });

  await test('Create test branch', async () => {
    const code = `TST${Date.now().toString().slice(-6)}`;
    const { status, data } = await req('POST', '/branches', {
      branchName: 'LomaX Test Branch',
      branchCode: code,
      ifscCode: `LOMX0${code}`,
      micrCode: '110002000',
      address: '123 Test Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      district: 'Mumbai',
      country: 'India',
      pincode: '400001',
      phone: '+91 9876543210',
      email: `testbranch.${code}@lomaxbank.com`,
      managerName: 'Test Manager',
      status: 'Active',
    });
    assert(status === 201 && data.success, data.message || 'Create branch failed');
    branchId = data.data._id;
  });

  await test('Get branch by ID', async () => {
    const { status, data } = await req('GET', `/branches/${branchId}`);
    assert(status === 200 && data.data, 'Get branch failed');
  });

  // ── Employees ───────────────────────────────────────────────────────────
  console.log('\n── Employee Management ──');
  await test('List employees by branch', async () => {
    const { status, data } = await req('GET', `/employees/branch/${branchId}`);
    assert(status === 200, `Employees list failed: ${status}`);
  });

  // ── Customer Registration (Admin creates dummy data) ────────────────────
  console.log('\n── Customer Registration & Approval ──');
  await test('Register dummy customer #1 (pending)', async () => {
    const { status, data } = await req('POST', '/auth/register', {
      firstName: 'Demo',
      lastName: 'Customer One',
      email: `demo.one.${Date.now()}@lomax.com`,
      mobile: '+91 9988776655',
      pan: 'ABCDE1234F',
      aadhaar: '123456789012',
      accountType: 'Savings Account',
      initialDeposit: '5000',
      branchId,
      autoGenerateLogin: true,
    });
    assert(status === 201 && data.success, data.message || 'Register failed');
    customerId = data.customerId;
    accountNumber = data.accountNumber;
    pendingId = null; // will find from pending list
  });

  await test('Register dummy customer #2 (pending)', async () => {
    const { status, data } = await req('POST', '/auth/register', {
      firstName: 'Demo',
      lastName: 'Customer Two',
      email: `demo.two.${Date.now()}@lomax.com`,
      mobile: '+91 8877665544',
      pan: 'FGHIJ5678K',
      aadhaar: '987654321098',
      accountType: 'Current Account',
      initialDeposit: '10000',
      branchId,
      autoGenerateLogin: true,
    });
    assert(status === 201 && data.success, data.message || 'Register #2 failed');
  });

  await test('List pending account approvals', async () => {
    const { status, data } = await req('GET', '/customer-accounts/pending');
    assert(status === 200 && Array.isArray(data.data), 'Pending list failed');
    const demo = data.data.find((a) => a.customerId === customerId);
    assert(demo, 'Demo customer not in pending list');
    pendingId = demo._id;
  });

  await test('Approve dummy customer account', async () => {
    const { status, data } = await req('POST', `/customer-accounts/${pendingId}/approve`);
    assert(status === 200 && data.success, data.message || 'Approve failed');
  });

  await test('List approved accounts', async () => {
    const { status, data } = await req('GET', '/customer-accounts/approved');
    assert(status === 200 && data.data.some((a) => a.customerId === customerId), 'Not in approved');
  });

  await test('List all customers', async () => {
    const { status, data } = await req('GET', '/auth/customers');
    assert(status === 200 && data.data.length > 0, 'No customers');
  });

  // ── Transactions ────────────────────────────────────────────────────────
  console.log('\n── Transaction Management ──');
  await test('Account lookup', async () => {
    const { status, data } = await req('GET', `/transactions/lookup/${accountNumber}`);
    assert(status === 200 && data.success, 'Lookup failed');
  });

  await test('Cash deposit', async () => {
    const { status, data } = await req('POST', '/transactions/deposit', {
      accountNumber,
      amount: 1000,
      remarks: 'E2E test deposit',
    });
    assert(status === 200 || status === 201, data.message || 'Deposit failed');
  });

  await test('Cash withdrawal', async () => {
    const { status, data } = await req('POST', '/transactions/withdraw', {
      accountNumber,
      amount: 500,
      remarks: 'E2E test withdrawal',
    });
    assert(status === 200 || status === 201, data.message || 'Withdraw failed');
  });

  await test('Get seeded account for transfer', async () => {
    const { status, data } = await req('GET', '/customer-accounts/approved');
    assert(status === 200 && data.data.length >= 2, 'Need 2 accounts for transfer');
  });

  await test('Fund transfer', async () => {
    const { data: approved } = await req('GET', '/customer-accounts/approved');
    const target = approved.data.find((a) => a.accountNumber !== accountNumber);
    assert(target, 'No target account');
    const { status, data } = await req('POST', '/transactions/transfer', {
      sourceAccount: accountNumber,
      targetAccount: target.accountNumber,
      amount: 100,
      transferType: 'Internal Transfer',
      remarks: 'E2E test transfer',
    });
    assert(status === 200 || status === 201, data.message || 'Transfer failed');
  });

  await test('Transaction history', async () => {
    const { status, data } = await req('GET', '/transactions/history');
    assert(status === 200, 'History failed');
  });

  await test('Account transaction history', async () => {
    const { status, data } = await req('GET', `/transactions/account/${accountNumber}`);
    assert(status === 200, 'Account history failed');
  });

  // ── Loans ───────────────────────────────────────────────────────────────
  console.log('\n── Loan Management ──');
  await test('Apply for loan', async () => {
    const { status, data } = await req('POST', '/loans/apply', {
      customerId,
      loanType: 'Personal Loan',
      amount: 50000,
      tenureMonths: 24,
      purpose: 'Home renovation',
      monthlyIncome: 75000,
    });
    assert(status === 201 && data.success, data.message || 'Loan apply failed');
    loanId = data.data._id;
  });

  await test('List loan applications', async () => {
    const { status, data } = await req('GET', '/loans');
    assert(status === 200 && data.data.length > 0, 'No loans');
  });

  await test('Approve loan application', async () => {
    const { status, data } = await req('PUT', `/loans/${loanId}/status`, { status: 'Approved' });
    assert(status === 200 && data.success, data.message || 'Loan approve failed');
  });

  // ── Cards ───────────────────────────────────────────────────────────────
  console.log('\n── Card Management ──');
  await test('Issue debit card', async () => {
    const { status, data } = await req('POST', '/cards/issue', {
      accountNumber,
      cardHolderName: 'Demo Customer One',
      cardType: 'Debit',
      cardNetwork: 'Visa',
    });
    assert(status === 201 && data.success, data.message || 'Issue card failed');
  });

  await test('Get cards by account', async () => {
    const { status, data } = await req('GET', `/cards/account/${accountNumber}`);
    assert(status === 200 && data.data.length > 0, 'No cards found');
  });

  // ── Support Tickets ─────────────────────────────────────────────────────
  console.log('\n── Support Center ──');
  await test('Create support ticket', async () => {
    const { status, data } = await req('POST', '/tickets', {
      customerId,
      subject: 'E2E Test Ticket',
      category: 'Technical Support',
      priority: 'Medium',
      description: 'Testing support ticket creation from E2E suite.',
    });
    assert(status === 201 || (status === 200 && data.success), data.message || 'Ticket create failed');
    if (data.data) ticketId = data.data._id;
  });

  await test('List support tickets', async () => {
    const { status, data } = await req('GET', '/tickets');
    assert(status === 200, 'Tickets list failed');
  });

  // ── Audit & Security ────────────────────────────────────────────────────
  console.log('\n── Audit & Security ──');
  await test('Audit logs', async () => {
    const { status, data } = await req('GET', '/audit');
    assert(status === 200, 'Audit logs failed');
  });

  // ── Notifications ─────────────────────────────────────────────────────
  console.log('\n── Notifications ──');
  await test('List notifications', async () => {
    const { status } = await req('GET', '/notifications');
    assert(status === 200 || status === 401, `Notifications unexpected: ${status}`);
  });

  // ── Analytics ─────────────────────────────────────────────────────────
  console.log('\n── Analytics ──');
  await test('Analytics (customer smart insights)', async () => {
    const { status, data } = await req('GET', '/analytics/smart', null, customerToken);
    assert(status === 200 && data.success !== false, `Analytics: ${status} ${data.message || ''}`);
  });

  // ── Customer Panel APIs ─────────────────────────────────────────────────
  console.log('\n── Customer Panel ──');
  await test('Customer account live balance', async () => {
    const { status, data } = await req('GET', `/accounts/live/${accountNumber}`, null, customerToken);
    assert(status === 200 || status === 401, `Live account: ${status}`);
  });

  await test('Customer lookup', async () => {
    const { status, data } = await req('GET', `/auth/lookup/customer/${customerId}`);
    assert(status === 200 && data.success, 'Customer lookup failed');
  });

  // ── Summary ─────────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log('\n' + '═'.repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${results.length}`);
  console.log('═'.repeat(50));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter((r) => r.status === 'FAIL').forEach((r) => {
      console.log(`  • ${r.name}: ${r.error}`);
    });
    process.exit(1);
  }

  console.log('\n🎉 All features tested successfully!');
  console.log('\nDemo credentials created:');
  console.log(`  Customer ID: ${customerId}`);
  console.log(`  Account:     ${accountNumber}`);
  console.log('  Admin:       admin@lomax.com / 123456789');
  console.log('  Staff:       EMP100001 / 123456789');
  console.log('  Seeded:      CUST100001 / 100001TSUC (or Password@123)\n');
}

run().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
