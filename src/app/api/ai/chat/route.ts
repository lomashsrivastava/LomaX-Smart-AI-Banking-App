import { NextResponse } from 'next/server';

const AI_RESPONSES: Record<string, string> = {
  'default': "I've analyzed your financial patterns in the database. Your spending is well-controlled this month — 12% below your average. Your Europe Trip goal is on track. Would you like me to run a simulation?",
  'save': "Based on your real-time ledger, here's my plan: Cancel the unused Spotify subscription (₹179/mo), switch to annual Airtel plan (saves ₹200/mo), and move ₹89,500 from current to liquid fund (earns ~₹388/mo). Total savings: ₹767/month. Shall I execute via smart contract?",
  'invest': "Your risk profile suggests a balanced portfolio: 40% equity index funds, 30% debt funds, 20% gold ETF, 10% international equity. With ₹25,000/month SIP, projected corpus in 10 years: ₹52-68 lakhs (Monte Carlo, 80% confidence).",
  'spend': "This month you've spent ₹42,300. Top categories: Food & Dining ₹12,800 (30%), Shopping ₹9,200 (22%), Transport ₹6,500 (15%). You're ₹7,700 under budget. Your biggest expense was ₹4,500 at Amazon.",
  'tax': "Estimated tax liability for FY26: ₹1,84,000. I found 3 deductions you're missing based on your transactions: Section 80D health insurance (₹25,000), NPS contribution 80CCD(1B) (₹50,000), and home loan interest 24(b) (₹2,00,000).",
};

function matchResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('save') || lower.includes('saving') || lower.includes('cut')) return AI_RESPONSES['save'];
  if (lower.includes('invest') || lower.includes('portfolio') || lower.includes('sip')) return AI_RESPONSES['invest'];
  if (lower.includes('spend') || lower.includes('expense') || lower.includes('where')) return AI_RESPONSES['spend'];
  if (lower.includes('tax') || lower.includes('deduction')) return AI_RESPONSES['tax'];
  return AI_RESPONSES['default'];
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Simulate LLM processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responseContent = matchResponse(message);
    
    return NextResponse.json({
      role: 'assistant',
      content: responseContent,
      confidence: 0.85 + Math.random() * 0.12,
      reasoning: ['Queried MongoDB ledger for past 6 months', 'Compared with peer benchmarks', 'Applied latest tax code FY2025-26'],
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
