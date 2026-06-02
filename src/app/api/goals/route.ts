import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Goal from '@/models/Goal';

export async function GET() {
  try {
    await connectToDatabase();
    const goals = await Goal.find({}).sort({ priority: 1 });
    return NextResponse.json(goals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
