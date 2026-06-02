'use client';
import { create } from 'zustand';
import type { Account, Transaction, Card, AiMessage, AiSuggestion, Goal, SimulationScenario, SimulationResult, UpiMandate, UpiLiteWallet, FamilyGroup, Invoice, AuditLog, SystemHealth, FraudEvent, ViewId } from './types';

// ---- Remaining Mock Data for un-migrated entities ----
const mockGoals: Goal[] = [
  { id: 'g1', userId: 'u1', name: 'Europe Trip 2026', targetAmount: 500000, currentAmount: 325000, deadline: '2026-12-31', priority: 1, status: 'active', color: '#00e5ff', aiStrategy: 'Save ₹12,500/month', predictedCompletionDate: '2026-10-15' },
  { id: 'g2', userId: 'u1', name: 'Emergency Fund', targetAmount: 600000, currentAmount: 480000, priority: 2, status: 'active', color: '#10b981', aiStrategy: 'Auto-transfer ₹15,000/month', predictedCompletionDate: '2026-04-01' },
];

const mockMandates: UpiMandate[] = [
  { id: 'man-1', merchantName: 'Netflix', merchantUpiId: 'netflix@axl', accountId: 'acc-1', maxAmount: 799, frequency: 'monthly', status: 'active', nextDebitDate: '2026-07-05', createdAt: '2024-06-01' },
];

const mockAuditLogs: AuditLog[] = Array.from({ length: 5 }, (_, i) => ({ id: `audit-${i}`, timestamp: new Date().toISOString(), userId: 'u1', action: 'login', resourceType: 'auth', resourceId: `ses-${i}`, details: `Login from authorized IP`, ipAddress: '192.168.1.100', merkleHash: `0x${Math.random().toString(16).slice(2, 18)}` }));

const mockSystemHealth: SystemHealth[] = [
  { service: 'API Gateway', status: 'healthy', latencyMs: 12, cpuUsage: 23, memoryUsage: 45, errorRate: 0.01, uptime: '99.99%' },
  { service: 'Ledger DB', status: 'healthy', latencyMs: 8, cpuUsage: 34, memoryUsage: 52, errorRate: 0.0, uptime: '99.99%' },
];

const mockFraudEvents: FraudEvent[] = [];
const mockFamily: FamilyGroup = { id: 'fam-1', name: 'The Gupta Family', totalNetWorth: 8500000, members: [], sharedGoals: [] };
const mockInvoices: Invoice[] = [];

// ---- Store Interface ----
interface AppState {
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;
  
  isFetchingData: boolean;
  fetchInitialData: () => Promise<void>;

  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  goals: Goal[];
  
  toggleCardStatus: (cardId: string) => Promise<void>;
  toggleCardOnline: (cardId: string) => Promise<void>;
  toggleCardInternational: (cardId: string) => Promise<void>;
  toggleCardNightLock: (cardId: string) => Promise<void>;
  generateVirtualCard: () => Promise<void>;
  
  aiMessages: AiMessage[];
  addAiMessage: (msg: AiMessage) => void;
  sendAiMessage: (content: string) => Promise<void>;
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

  isFetchingData: true,
  accounts: [],
  transactions: [],
  cards: [],
  goals: mockGoals,
  netWorth: 0,

  fetchInitialData: async () => {
    set({ isFetchingData: true });
    try {
      const [accRes, txRes, cardRes, goalRes, manRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/transactions'),
        fetch('/api/cards'),
        fetch('/api/goals'),
        fetch('/api/upi/mandates')
      ]);
      const accounts = await accRes.json();
      const transactions = await txRes.json();
      const cards = await cardRes.json();
      const goals = await goalRes.json();
      const mandates = await manRes.json();
      
      const netWorth = accounts.reduce((s: number, a: Account) => s + a.balance, 0);
      set({ accounts, transactions, cards, goals, mandates, netWorth, isFetchingData: false });
    } catch (e) {
      console.error('Failed to fetch initial data', e);
      set({ isFetchingData: false });
    }
  },

  toggleCardStatus: async (cardId) => {
    const res = await fetch('/api/cards', { method: 'POST', body: JSON.stringify({ action: 'toggleStatus', cardId }) });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({ cards: s.cards.map(c => c._id === updated._id || c.id === cardId ? { ...c, status: updated.status } : c) }));
    }
  },
  toggleCardOnline: async (cardId) => {
    const res = await fetch('/api/cards', { method: 'POST', body: JSON.stringify({ action: 'toggleOnline', cardId }) });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({ cards: s.cards.map(c => c._id === updated._id || c.id === cardId ? { ...c, onlineEnabled: updated.onlineEnabled } : c) }));
    }
  },
  toggleCardInternational: async (cardId) => {
    const res = await fetch('/api/cards', { method: 'POST', body: JSON.stringify({ action: 'toggleInternational', cardId }) });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({ cards: s.cards.map(c => c._id === updated._id || c.id === cardId ? { ...c, internationalEnabled: updated.internationalEnabled } : c) }));
    }
  },
  toggleCardNightLock: async (cardId) => {
    const res = await fetch('/api/cards', { method: 'POST', body: JSON.stringify({ action: 'toggleNightLock', cardId }) });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({ cards: s.cards.map(c => c._id === updated._id || c.id === cardId ? { ...c, nightLockEnabled: updated.nightLockEnabled } : c) }));
    }
  },
  generateVirtualCard: async () => {
    const userId = get().accounts[0]?.userId; 
    const res = await fetch('/api/cards', { method: 'POST', body: JSON.stringify({ action: 'generate', userId }) });
    if (res.ok) {
      const newCard = await res.json();
      set((s) => ({ cards: [...s.cards, newCard] }));
    }
  },

  aiMessages: [
    { id: 'ai-0', role: 'assistant', content: "Hello! I'm Loma, your AI CFO. I've analyzed your backend ledger. Ask me anything!", timestamp: new Date().toISOString(), confidence: 0.97 },
  ],
  addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),
  sendAiMessage: async (content) => {
    const userMsg: AiMessage = { id: `msg-${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() };
    set((s) => ({ aiMessages: [...s.aiMessages, userMsg] }));
    
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message: content }) });
      if (res.ok) {
        const responseData = await res.json();
        const aiMsg: AiMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: responseData.content,
          timestamp: responseData.timestamp,
          confidence: responseData.confidence,
          reasoning: responseData.reasoning
        };
        set((s) => ({ aiMessages: [...s.aiMessages, aiMsg] }));
      }
    } catch (e) {
      console.error(e);
    }
  },

  aiSuggestions: [],
  simulationScenarios: [
    { id: 'sim-1', name: 'Buy a House in 2028', description: 'Simulate saving for a ₹30L down payment', parameters: { monthlySaving: 50000, expectedReturn: 8, inflationRate: 6, targetAmount: 3000000 } as Record<string, number>, status: 'idle' as const, createdAt: new Date().toISOString() },
  ],
  activeSimulation: null,
  runSimulation: async (scenarioId) => {
    const scenario = get().simulationScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    set((s) => ({ simulationScenarios: s.simulationScenarios.map(sc => sc.id === scenarioId ? { ...sc, status: 'running' } : sc), activeSimulation: { ...scenario, status: 'running' } }));
    
    try {
      const res = await fetch('/api/twin/simulate', { method: 'POST', body: JSON.stringify(scenario.parameters) });
      if (res.ok) {
        const result = await res.json();
        set((s) => ({ simulationScenarios: s.simulationScenarios.map(sc => sc.id === scenarioId ? { ...sc, status: 'completed', results: result } : sc), activeSimulation: { ...scenario, status: 'completed', results: result } }));
      }
    } catch (e) {
      console.error(e);
    }
  },

  mandates: mockMandates,
  upiLite: { balance: 1500, maxBalance: 2000, lastTopUp: new Date().toISOString() },
  familyGroup: mockFamily,
  invoices: mockInvoices,
  auditLogs: mockAuditLogs,
  systemHealth: mockSystemHealth,
  fraudEvents: mockFraudEvents,
}));
