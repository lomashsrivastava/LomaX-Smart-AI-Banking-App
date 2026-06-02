import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  type: 'credit' | 'debit' | 'transfer' | 'upi' | 'neft' | 'rtgs' | 'imps' | 'card' | 'refund' | 'chargeback';
  aiNarrative: string;
  riskScore: number;
  fraudDecision: 'allow' | 'challenge' | 'block';
  merchantName?: string;
  merchantCategoryCode?: string;
  category: string;
  location?: { lat: number; lng: number };
  signature: string;
}

const TransactionSchema: Schema = new Schema({
  fromAccountId: { type: String, required: true }, // Not ObjectId because external accounts exist
  toAccountId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'reversed'], default: 'completed' },
  type: { type: String, enum: ['credit', 'debit', 'transfer', 'upi', 'neft', 'rtgs', 'imps', 'card', 'refund', 'chargeback'], required: true },
  aiNarrative: { type: String },
  riskScore: { type: Number, default: 0 },
  fraudDecision: { type: String, enum: ['allow', 'challenge', 'block'], default: 'allow' },
  merchantName: { type: String },
  merchantCategoryCode: { type: String },
  category: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  signature: { type: String, required: true },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
