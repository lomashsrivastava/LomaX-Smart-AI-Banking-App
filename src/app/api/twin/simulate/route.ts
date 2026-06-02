import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { monthlySaving, expectedReturn, inflationRate, targetAmount } = body;

    // Simulate backend processing time for complex Monte Carlo calculations
    await new Promise(resolve => setTimeout(resolve, 1800));

    // A standard Monte Carlo geometric brownian motion simplified for demo
    const months = 36;
    const timeline = [];
    const monthlyRate = (expectedReturn - inflationRate) / 100 / 12;
    
    let p10_final = 0, p50_final = 0, p90_final = 0;
    
    let currentBalance = 0;
    for (let i = 1; i <= months; i++) {
      // Add variance simulating market volatility
      const variance = 1 + (Math.random() * 0.04 - 0.02); 
      currentBalance = (currentBalance + monthlySaving) * (1 + monthlyRate) * variance;
      timeline.push({
        month: i,
        balance: currentBalance,
        confidence: 0.8 + (Math.random() * 0.15)
      });
      
      if (i === months) {
        p50_final = currentBalance;
        p10_final = currentBalance * 0.85;
        p90_final = currentBalance * 1.15;
      }
    }

    const successProbability = Math.min(0.99, p50_final / targetAmount);
    
    return NextResponse.json({
      percentiles: {
        p10: p10_final,
        p50: p50_final,
        p90: p90_final
      },
      timeline,
      riskFactors: ['Inflation spike', 'Market downturn in tech sector', 'Income interruption'],
      recommendation: successProbability > 0.8 
        ? 'Excellent probability of success. Maintain current SIPs.' 
        : 'Consider increasing monthly savings by 15% to reach target safely.',
      successProbability
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
