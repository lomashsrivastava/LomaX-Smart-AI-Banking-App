import mongoose, { Document, Schema } from 'mongoose';

export interface ILedgerEntry extends Document {
  referenceNumber: string;
  accountNumber: string;
  type: 'debit' | 'credit';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  remarks?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const LedgerEntrySchema: Schema = new Schema({
  referenceNumber: { type: String, required: true, index: true },
  accountNumber: { type: String, required: true, index: true },
  type: { type: String, enum: ['debit', 'credit'], required: true },
  amount: { type: Number, required: true, min: 0 },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  remarks: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to guarantee uniqueness of referenceNumber, accountNumber and type combo
LedgerEntrySchema.index({ referenceNumber: 1, accountNumber: 1, type: 1 }, { unique: true });

export default mongoose.model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);
