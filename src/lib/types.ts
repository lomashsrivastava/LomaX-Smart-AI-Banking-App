/* ============================================
   LomaX NEO - Complete Type System
   All interfaces for the Financial Singularity OS
   ============================================ */

// ---- User & Profile ----
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatarUrl?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  trustScore: number; // 0-1000
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'glass';
  animationIntensity: 'low' | 'medium' | 'high';
  holographicMode: 'galaxy' | 'vault' | 'terrain' | 'hearth' | 'engine' | 'control';
  language: string;
  notificationsEnabled: boolean;
}

// ---- Accounts ----
export type AccountType = 'savings' | 'current' | 'joint' | 'business' | 'premium' | 'children';
export type AccountStatus = 'nebula' | 'active' | 'dormant' | 'frozen' | 'archived';

export interface Account {
  id: string;
  userId: string;
  accountType: AccountType;
  accountNumber: string; // masked display
  ifscCode: string;
  balance: number;
  currency: string;
  interestRate: number;
  status: AccountStatus;
  openingDate: string;
  healthScore: number; // 0-100
  color: string; // for UI moon rendering
}

// ---- Transactions ----
export type TransactionType = 'credit' | 'debit' | 'transfer' | 'upi' | 'neft' | 'rtgs' | 'imps' | 'card' | 'refund' | 'chargeback';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';
export type FraudDecision = 'allow' | 'challenge' | 'block';

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: TransactionStatus;
  type: TransactionType;
  aiNarrative: string;
  riskScore: number; // 0-1000
  fraudDecision: FraudDecision;
  merchantName?: string;
  merchantCategoryCode?: string;
  category: string;
  location?: { lat: number; lng: number };
  signature: string; // post-quantum signature hash
}

// ---- Double-Entry Ledger ----
export interface JournalEntry {
  entryId: string;
  transactionId: string;
  accountId: string;
  amount: number; // positive = credit, negative = debit
  timestamp: string;
}

// ---- Cards ----
export type CardType = 'physical' | 'virtual' | 'tokenized';
export type CardNetwork = 'visa' | 'mastercard' | 'rupay' | 'amex';
export type CardStatus = 'active' | 'frozen' | 'expired' | 'closed';

export interface Card {
  id: string;
  userId: string;
  cardType: CardType;
  cardNetwork: CardNetwork;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  status: CardStatus;
  currentCvv: string; // rotates every hour (simulated)
  limits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  geoControls: string[]; // allowed country codes
  merchantControls: {
    allowed: string[];
    blocked: string[];
  };
  onlineEnabled: boolean;
  internationalEnabled: boolean;
  nightLockEnabled: boolean;
  designTheme: string;
  lastUsedAt: string;
  createdAt: string;
}

// ---- UPI ----
export interface UpiId {
  id: string;
  handle: string; // e.g. username@lomax
  accountId: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UpiMandate {
  id: string;
  merchantName: string;
  merchantUpiId: string;
  accountId: string;
  maxAmount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'paused' | 'revoked';
  nextDebitDate: string;
  createdAt: string;
}

export interface UpiLiteWallet {
  balance: number;
  maxBalance: number;
  lastTopUp: string;
}

// ---- AI CFO ----
export type AiMessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  timestamp: string;
  toolCalled?: string;
  reasoning?: string[];
  confidence?: number;
  isStreaming?: boolean;
}

export interface AiSuggestion {
  id: string;
  type: 'save' | 'invest' | 'cancel_subscription' | 'pay_bill' | 'optimize' | 'alert';
  title: string;
  description: string;
  potentialSavings: number;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ---- Digital Twin ----
export interface TwinConfig {
  avatarStyle: 'galaxy' | 'realistic' | 'abstract';
  voicePitch: number;
  personalityTraits: string[];
  auraColor: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  results?: SimulationResult;
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: string;
}

export interface SimulationResult {
  percentiles: { p10: number; p25: number; p50: number; p75: number; p90: number };
  timeline: { month: number; balance: number; confidence: number }[];
  riskFactors: string[];
  recommendation: string;
  successProbability: number;
}

// ---- Goals ----
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'active' | 'achieved' | 'abandoned';
  color: string;
  aiStrategy?: string;
  predictedCompletionDate?: string;
}

// ---- Family Banking ----
export type FamilyRole = 'prime' | 'spouse' | 'child' | 'elder' | 'guardian';

export interface FamilyMember {
  userId: string;
  name: string;
  role: FamilyRole;
  avatarUrl?: string;
  allowance?: {
    amount: number;
    frequency: 'weekly' | 'biweekly' | 'monthly';
    spendingLimit: number;
  };
}

export interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  sharedGoals: Goal[];
  totalNetWorth: number;
}

// ---- Business Banking ----
export interface BusinessProfile {
  id: string;
  ownerId: string;
  businessName: string;
  gstNumber?: string;
  businessType: 'sole_proprietorship' | 'partnership' | 'private_limited';
  employees: Employee[];
  cashFlowForecast?: CashFlowForecast;
}

export interface Employee {
  id: string;
  name: string;
  bankAccount: string;
  salary: number;
  department: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  totalAmount: number;
  taxAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'partially_paid';
  dueDate: string;
  sentDate?: string;
  paidDate?: string;
  createdAt: string;
}

export interface CashFlowForecast {
  days: { date: string; inflow: number; outflow: number; balance: number }[];
  lowestBalance: number;
  lowestBalanceDate: string;
  riskOfOverdraft: boolean;
}

// ---- Fraud & Audit ----
export interface FraudEvent {
  id: string;
  transactionId?: string;
  userId: string;
  ruleTriggered: string;
  mlScore: number;
  decision: FraudDecision;
  resolution: 'false_positive' | 'confirmed_fraud' | 'under_review';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  merkleHash: string;
}

// ---- Admin / System ----
export interface SystemHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  cpuUsage: number;
  memoryUsage: number;
  errorRate: number;
  uptime: string;
}

export interface NeoScore {
  total: number; // 0-1000
  magicAdoptionRate: number;
  holographicSessionDepth: number;
  autonomousSavingsRate: number;
  trustQuotient: number;
  securityIncidentRate: number;
  uptime: number;
}

// ---- Navigation ----
export type ViewId =
  | 'observatory'
  | 'vault'
  | 'twin'
  | 'ai-cfo'
  | 'cards'
  | 'upi'
  | 'family'
  | 'business'
  | 'goals'
  | 'analytics'
  | 'admin'
  | 'settings';
