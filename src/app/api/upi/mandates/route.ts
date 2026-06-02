import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UpiMandate from '@/models/UpiMandate';

export async function GET() {
  try {
    await connectToDatabase();
    const mandates = await UpiMandate.find({}).sort({ nextDebitDate: 1 });
    return NextResponse.json(mandates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { action, mandateId } = await req.json();

    if (!mandateId) return NextResponse.json({ error: 'mandateId required' }, { status: 400 });
    
    const mandate = await UpiMandate.findById(mandateId);
    if (!mandate) return NextResponse.json({ error: 'Mandate not found' }, { status: 404 });

    if (action === 'toggleStatus') {
      mandate.status = mandate.status === 'active' ? 'paused' : 'active';
      if (mandate.status === 'paused') {
        mandate.aiInsights = 'Autonomously paused by smart contract rule (Balance Protection).';
      } else {
        mandate.aiInsights = 'Resumed.';
      }
      await mandate.save();
    }

    return NextResponse.json(mandate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
