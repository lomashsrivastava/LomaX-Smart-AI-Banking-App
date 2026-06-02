import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all transactions, sort by most recent
    const transactions = await Transaction.find({}).sort({ timestamp: -1 }).limit(100);
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
