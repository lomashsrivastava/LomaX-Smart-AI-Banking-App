import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from './src/utils/seeder';

dotenv.config();

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

  const result = await seedDatabase();

  console.log('\n🎉 Seeding complete! Summary:');
  console.log(`   Branches:     ${result.branchesCount}`);
  console.log(`   Employees:    ${result.employeesCount}`);
  console.log(`   Customers:   ${result.customersCount}`);
  console.log(`   Accounts:    ${result.accountsCount}`);
  console.log(`   Transactions: ${result.transactionsCount}`);
  console.log(`   Loans:        ${result.loansCount}`);
  console.log(`   Tickets:      ${result.ticketsCount}`);
  console.log('\nDefault logins for seeded users:');
  console.log('   Admin:    admin@lomax.com / 123456789');
  console.log('   Staff:    EMP100001 / 123456789');
  console.log(`   Customer: CUST100001 / Password@123\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
