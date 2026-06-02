import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Account from '@/models/Account';

export async function GET() {
  try {
    await connectToDatabase();
    // In a real app, we would get the userId from NextAuth session
    // For now, we just fetch all accounts assuming a single user simulated setup
    const accounts = await Account.find({}).sort({ openingDate: 1 });
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
