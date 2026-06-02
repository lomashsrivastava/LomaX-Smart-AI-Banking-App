'use client';
import { create } from 'zustand';
import type { Account, Transaction, Card, AiMessage, AiSuggestion, Goal, SimulationScenario, SimulationResult, UpiMandate, UpiLiteWallet, FamilyGroup, Invoice, AuditLog, SystemHealth, FraudEvent, ViewId } from './types';

// ---- Mock Data Generators ----
const mockAccounts: Account[] = [
  { id: 'acc-1', userId: 'u1', accountType: 'savings', accountNumber: '****4521', ifscCode: 'LMAX0001', balance: 245000, currency: 'INR', interestRate: 4.5, status: 'active', openingDate: '2024-01-15', healthScore: 82, color: '#00e5ff' },
  { id: 'acc-2', userId: 'u1', accountType: 'current', accountNumber: '****7832', ifscCode: 'LMAX0001', balance: 89500, currency: 'INR', interestRate: 0, status: 'active', openingDate: '2024-03-10', healthScore: 68, color: '#b900ff' },
  { id: 'acc-3', userId: 'u1', accountType: 'business', accountNumber: '****1290', ifscCode: 'LMAX0002', balance: 1250000, currency: 'INR', interestRate: 2.0, status: 'active', openingDate: '2024-06-01', healthScore: 91, color: '#ff007f' },
  { id: 'acc-4', userId: 'u1', accountType: 'premium', accountNumber: '****9988', ifscCode: 'LMAX0001', balance: 5420000, currency: 'INR', interestRate: 6.2, status: 'active', openingDate: '2023-11-20', healthScore: 95, color: '#10b981' },
];

const categories = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills & Utilities', 'Health', 'Education', 'Investment', 'Salary', 'Freelance', 'Refund', 'Transfer'];
const merchants = ['Zomato', 'Amazon', 'Uber', 'Netflix', 'Airtel', 'Apollo Pharmacy', 'Coursera', 'Groww', 'TechCorp Inc', 'DesignStudio', 'Flipkart', 'Swiggy'];

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  for (let i = 0; i < 50; i++) {
    const isCredit = Math.random() > 0.6;
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const amt = isCredit ? Math.floor(Math.random() * 100000) + 5000 : Math.floor(Math.random() * 15000) + 100;
    const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 60));
    txns.push({
      id: `txn-${i}`, fromAccountId: isCredit ? 'ext' : 'acc-1', toAccountId: isCredit ? 'acc-1' : 'ext',
      amount: amt, currency: 'INR', timestamp: d.toISOString(),
      status: 'completed', type: isCredit ? 'credit' : 'debit',
      aiNarrative: isCredit ? `Received ₹${amt.toLocaleString()} from ${merchant}` : `Paid ₹${amt.toLocaleString()} to ${merchant} for ${cat}`,
      riskScore: Math.floor(Math.random() * 200), fraudDecision: 'allow',
      merchantName: merchant, category: cat,
      signature: `dilithium-sig-${Math.random().toString(36).slice(2, 10)}`,
    });
  }
  return txns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

const mockCards: Card[] = [
  { id: 'card-1', userId: 'u1', cardType: 'physical', cardNetwork: 'visa', lastFour: '4521', expiryMonth: 12, expiryYear: 2028, status: 'active', currentCvv: '738', limits: { daily: 100000, monthly: 500000, perTransaction: 50000 }, geoControls: ['IN'], merchantControls: { allowed: [], blocked: ['7995'] }, onlineEnabled: true, internationalEnabled: false, nightLockEnabled: false, designTheme: 'galaxy-nebula', lastUsedAt: new Date().toISOString(), createdAt: '2024-01-15' },
  { id: 'card-2', userId: 'u1', cardType: 'virtual', cardNetwork: 'mastercard', lastFour: '8899', expiryMonth: 6, expiryYear: 2027, status: 'active', currentCvv: '412', limits: { daily: 25000, monthly: 100000, perTransaction: 10000 }, geoControls: ['IN', 'US', 'GB'], merchantControls: { allowed: [], blocked: [] }, onlineEnabled: true, internationalEnabled: true, nightLockEnabled: true, designTheme: 'aurora-wave', lastUsedAt: new Date().toISOString(), createdAt: '2024-08-20' },
  { id: 'card-3', userId: 'u1', cardType: 'physical', cardNetwork: 'rupay', lastFour: '3367', expiryMonth: 3, expiryYear: 2029, status: 'frozen', currentCvv: '---', limits: { daily: 200000, monthly: 1000000, perTransaction: 100000 }, geoControls: ['IN'], merchantControls: { allowed: [], blocked: [] }, onlineEnabled: false, internationalEnabled: false, nightLockEnabled: false, designTheme: 'deep-space', lastUsedAt: '2024-11-01', createdAt: '2023-11-20' },
];

const mockGoals: Goal[] = [
  { id: 'g1', userId: 'u1', name: 'Europe Trip 2026', targetAmount: 500000, currentAmount: 325000, deadline: '2026-12-31', priority: 1, status: 'active', color: '#00e5ff', aiStrategy: 'Save ₹12,500/month', predictedCompletionDate: '2026-10-15' },
  { id: 'g2', userId: 'u1', name: 'Emergency Fund', targetAmount: 600000, currentAmount: 480000, priority: 2, status: 'active', color: '#10b981', aiStrategy: 'Auto-transfer ₹15,000/month', predictedCompletionDate: '2026-04-01' },
  { id: 'g3', userId: 'u1', name: 'MacBook Pro M5', targetAmount: 250000, currentAmount: 92000, deadline: '2026-08-01', priority: 3, status: 'active', color: '#b900ff', aiStrategy: 'Cancel unused subs + save ₹20,000/month' },
  { id: 'g4', userId: 'u1', name: 'Home Down Payment', targetAmount: 3000000, currentAmount: 780000, deadline: '2028-06-01', priority: 1, status: 'active', color: '#f59e0b', aiStrategy: 'Invest surplus in balanced fund' },
];

const mockMandates: UpiMandate[] = [
  { id: 'man-1', merchantName: 'Netflix', merchantUpiId: 'netflix@axl', accountId: 'acc-1', maxAmount: 799, frequency: 'monthly', status: 'active', nextDebitDate: '2026-07-05', createdAt: '2024-06-01' },
  { id: 'man-2', merchantName: 'Airtel Broadband', merchantUpiId: 'airtel@ybl', accountId: 'acc-1', maxAmount: 1499, frequency: 'monthly', status: 'active', nextDebitDate: '2026-07-10', createdAt: '2024-03-15' },
  { id: 'man-3', merchantName: 'Spotify', merchantUpiId: 'spotify@paytm', accountId: 'acc-1', maxAmount: 179, frequency: 'monthly', status: 'paused', nextDebitDate: '2026-07-01', createdAt: '2024-09-20' },
];

const mockAuditLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => {
  const actions = ['login', 'transfer', 'card_freeze', 'settings_change', 'ai_suggestion_accepted', 'simulation_run', 'upi_payment'];
  const d = new Date(); d.setHours(d.getHours() - i * 3);
  return { id: `audit-${i}`, timestamp: d.toISOString(), userId: 'u1', action: actions[i % actions.length], resourceType: 'transaction', resourceId: `txn-${i}`, details: `Action performed: ${actions[i % actions.length]}`, ipAddress: '192.168.1.' + (100 + i), merkleHash: `0x${Math.random().toString(16).slice(2, 18)}` };
});

const mockSystemHealth: SystemHealth[] = [
  { service: 'API Gateway', status: 'healthy', latencyMs: 12, cpuUsage: 23, memoryUsage: 45, errorRate: 0.01, uptime: '99.99%' },
  { service: 'Ledger Service', status: 'healthy', latencyMs: 8, cpuUsage: 34, memoryUsage: 52, errorRate: 0.0, uptime: '99.99%' },
  { service: 'Fraud Engine', status: 'healthy', latencyMs: 45, cpuUsage: 67, memoryUsage: 71, errorRate: 0.02, uptime: '99.98%' },
  { service: 'AI Orchestrator', status: 'degraded', latencyMs: 1200, cpuUsage: 89, memoryUsage: 85, errorRate: 0.5, uptime: '99.90%' },
  { service: 'Twin Simulator', status: 'healthy', latencyMs: 320, cpuUsage: 45, memoryUsage: 60, errorRate: 0.0, uptime: '99.99%' },
  { service: 'Notification Svc', status: 'healthy', latencyMs: 15, cpuUsage: 12, memoryUsage: 30, errorRate: 0.0, uptime: '100%' },
  { service: 'Card Processor', status: 'healthy', latencyMs: 22, cpuUsage: 28, memoryUsage: 40, errorRate: 0.01, uptime: '99.99%' },
  { service: 'UPI Service', status: 'healthy', latencyMs: 18, cpuUsage: 31, memoryUsage: 38, errorRate: 0.0, uptime: '99.99%' },
];

const mockFraudEvents: FraudEvent[] = [
  { id: 'fr-1', transactionId: 'txn-12', userId: 'u42', ruleTriggered: 'velocity_check', mlScore: 0.87, decision: 'block', resolution: 'confirmed_fraud', timestamp: new Date().toISOString() },
  { id: 'fr-2', transactionId: 'txn-18', userId: 'u58', ruleTriggered: 'geo_anomaly', mlScore: 0.62, decision: 'challenge', resolution: 'false_positive', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'fr-3', userId: 'u91', ruleTriggered: 'device_fingerprint_mismatch', mlScore: 0.93, decision: 'block', resolution: 'under_review', timestamp: new Date(Date.now() - 7200000).toISOString() },
];

const mockFamily: FamilyGroup = {
  id: 'fam-1', name: 'The Gupta Family', totalNetWorth: 8500000,
  members: [
    { userId: 'u1', name: 'Anil Gupta', role: 'prime', avatarUrl: '' },
    { userId: 'u2', name: 'Sunita Gupta', role: 'spouse', avatarUrl: '' },
    { userId: 'u3', name: 'Kavya Gupta', role: 'child', avatarUrl: '', allowance: { amount: 3000, frequency: 'monthly', spendingLimit: 1000 } },
    { userId: 'u4', name: 'Rohan Gupta', role: 'child', avatarUrl: '', allowance: { amount: 2000, frequency: 'monthly', spendingLimit: 500 } },
  ],
  sharedGoals: [
    { id: 'sg1', userId: 'fam-1', name: 'Family Vacation Goa', targetAmount: 200000, currentAmount: 145000, deadline: '2026-12-20', priority: 1, status: 'active', color: '#f59e0b' },
    { id: 'sg2', userId: 'fam-1', name: 'Kavya College Fund', targetAmount: 2000000, currentAmount: 620000, deadline: '2030-06-01', priority: 1, status: 'active', color: '#b900ff' },
  ],
};

const mockInvoices: Invoice[] = [
  { id: 'inv-1', clientName: 'TechCorp Solutions', clientEmail: 'pay@techcorp.com', items: [{ description: 'UI/UX Design - March', quantity: 1, rate: 85000, amount: 85000 }], totalAmount: 100300, taxAmount: 15300, status: 'paid', dueDate: '2026-04-15', sentDate: '2026-03-20', paidDate: '2026-04-10', createdAt: '2026-03-18' },
  { id: 'inv-2', clientName: 'StartupXYZ', clientEmail: 'finance@startupxyz.io', items: [{ description: 'Brand Identity Package', quantity: 1, rate: 120000, amount: 120000 }], totalAmount: 141600, taxAmount: 21600, status: 'overdue', dueDate: '2026-05-01', sentDate: '2026-04-15', createdAt: '2026-04-12' },
  { id: 'inv-3', clientName: 'GreenLeaf Organics', clientEmail: 'ap@greenleaf.in', items: [{ description: 'Social Media Management - May', quantity: 1, rate: 45000, amount: 45000 }, { description: 'Ad Creatives (10 units)', quantity: 10, rate: 3000, amount: 30000 }], totalAmount: 88500, taxAmount: 13500, status: 'sent', dueDate: '2026-06-30', sentDate: '2026-06-01', createdAt: '2026-05-28' },
];

// ---- Store Interface ----
interface AppState {
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  goals: Goal[];
  toggleCardStatus: (cardId: string) => void;
  toggleCardOnline: (cardId: string) => void;
  toggleCardInternational: (cardId: string) => void;
  toggleCardNightLock: (cardId: string) => void;
  generateVirtualCard: () => void;
  aiMessages: AiMessage[];
  addAiMessage: (msg: AiMessage) => void;
  aiSuggestions: AiSuggestion[];
  simulationScenarios: SimulationScenario[];
  activeSimulation: SimulationScenario | null;
  runSimulation: (scenarioId: string) => void;
  mandates: UpiMandate[];
  upiLite: UpiLiteWallet;
  familyGroup: FamilyGroup;
  invoices: Invoice[];
  auditLogs: AuditLog[];
  systemHealth: SystemHealth[];
  fraudEvents: FraudEvent[];
  netWorth: number;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeView: 'observatory',
  setActiveView: (v) => set({ activeView: v }),

  accounts: mockAccounts,
  transactions: generateTransactions(),
  cards: mockCards,
  goals: mockGoals,
  netWorth: mockAccounts.reduce((s, a) => s + a.balance, 0),

  toggleCardStatus: (cardId) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c)
  })),
  toggleCardOnline: (cardId) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, onlineEnabled: !c.onlineEnabled } : c)
  })),
  toggleCardInternational: (cardId) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, internationalEnabled: !c.internationalEnabled } : c)
  })),
  toggleCardNightLock: (cardId) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, nightLockEnabled: !c.nightLockEnabled } : c)
  })),
  generateVirtualCard: () => set((s) => {
    const newCard: Card = {
      id: `card-${Date.now()}`, userId: 'u1', cardType: 'virtual', cardNetwork: 'visa',
      lastFour: String(Math.floor(1000 + Math.random() * 9000)), expiryMonth: 12, expiryYear: 2027,
      status: 'active', currentCvv: String(Math.floor(100 + Math.random() * 900)),
      limits: { daily: 10000, monthly: 50000, perTransaction: 5000 },
      geoControls: ['IN'], merchantControls: { allowed: [], blocked: [] },
      onlineEnabled: true, internationalEnabled: false, nightLockEnabled: false,
      designTheme: 'quantum-pulse', lastUsedAt: '', createdAt: new Date().toISOString(),
    };
    return { cards: [...s.cards, newCard] };
  }),

  aiMessages: [
    { id: 'ai-0', role: 'assistant', content: "Hello! I'm Loma, your AI CFO. I've analyzed your finances and found 3 opportunities to save ₹4,200/month. Ask me anything!", timestamp: new Date().toISOString(), confidence: 0.97 },
  ],
  addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),
  aiSuggestions: [
    { id: 'sug-1', type: 'cancel_subscription', title: 'Cancel unused Spotify', description: 'You haven\'t used Spotify in 45 days. Cancel to save ₹179/month.', potentialSavings: 179, confidence: 0.92, status: 'pending', createdAt: new Date().toISOString() },
    { id: 'sug-2', type: 'optimize', title: 'Switch electricity provider', description: 'Tata Power offers 12% lower rates for your usage pattern.', potentialSavings: 450, confidence: 0.85, status: 'pending', createdAt: new Date().toISOString() },
    { id: 'sug-3', type: 'invest', title: 'Invest idle balance', description: '₹89,500 in current account earning 0%. Move to liquid fund for 5.2% returns.', potentialSavings: 388, confidence: 0.88, status: 'pending', createdAt: new Date().toISOString() },
  ],

  simulationScenarios: [
    { id: 'sim-1', name: 'Buy a House in 2028', description: 'Simulate saving for a ₹30L down payment', parameters: { monthlySaving: 50000, expectedReturn: 8, inflationRate: 6, targetAmount: 3000000 } as Record<string, number>, status: 'idle' as const, createdAt: new Date().toISOString() },
    { id: 'sim-2', name: 'Retire at 50', description: 'Can I retire early with current savings rate?', parameters: { currentAge: 34, retirementAge: 50, monthlyExpense: 80000, corpusNeeded: 30000000 } as Record<string, number>, status: 'idle' as const, createdAt: new Date().toISOString() },
    { id: 'sim-3', name: 'Start a Business', description: 'What if I quit and bootstrap a startup?', parameters: { savings: 2000000, monthlyBurn: 150000, revenueStart: 6, breakEven: 18 } as Record<string, number>, status: 'idle' as const, createdAt: new Date().toISOString() },
  ],
  activeSimulation: null,
  runSimulation: (scenarioId) => {
    const scenario = get().simulationScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    set((s) => ({ simulationScenarios: s.simulationScenarios.map(sc => sc.id === scenarioId ? { ...sc, status: 'running' } : sc), activeSimulation: { ...scenario, status: 'running' } }));
    setTimeout(() => {
      const timeline = Array.from({ length: 36 }, (_, i) => {
        const base = (scenario.parameters.monthlySaving || 50000) * (i + 1);
        const growth = base * (1 + (scenario.parameters.expectedReturn || 8) / 100 / 12);
        const variance = (Math.random() - 0.5) * base * 0.15;
        return { month: i + 1, balance: Math.round(growth + variance), confidence: Math.max(0.6, 0.95 - i * 0.008) };
      });
      const result: SimulationResult = {
        percentiles: { p10: timeline[35].balance * 0.75, p25: timeline[35].balance * 0.88, p50: timeline[35].balance, p75: timeline[35].balance * 1.12, p90: timeline[35].balance * 1.3 },
        timeline, riskFactors: ['Market downturn in first 12 months', 'Unexpected medical expense', 'Job loss or income reduction'],
        recommendation: `Based on 10,000 simulations, you have a 78% chance of reaching your goal. Consider increasing monthly savings by ₹5,000 to improve to 89%.`,
        successProbability: 0.78,
      };
      set((s) => ({ simulationScenarios: s.simulationScenarios.map(sc => sc.id === scenarioId ? { ...sc, status: 'completed', results: result } : sc), activeSimulation: { ...scenario, status: 'completed', results: result } }));
    }, 2500);
  },

  mandates: mockMandates,
  upiLite: { balance: 1500, maxBalance: 2000, lastTopUp: new Date().toISOString() },
  familyGroup: mockFamily,
  invoices: mockInvoices,
  auditLogs: mockAuditLogs,
  systemHealth: mockSystemHealth,
  fraudEvents: mockFraudEvents,
}));
