import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  sourceAccount: mongoose.Types.ObjectId;
  targetAccount?: mongoose.Types.ObjectId; // Optional for external transfers
  type: 'credit' | 'debit';
  transferMode: 'Own Account Transfer' | 'Internal Transfer' | 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'Deposit' | 'Withdrawal';
  amount: number;
  remarks?: string;
  payeeName?: string;
  payeeAccount?: string;
  ifscCode?: string;
  upiId?: string;
  category?: string;
  status: 'pending' | 'completed' | 'failed';
  idempotencyKey?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  sourceAccount: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  targetAccount: { type: Schema.Types.ObjectId, ref: 'Account' },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  transferMode: { type: String, enum: ['Own Account Transfer', 'Internal Transfer', 'NEFT', 'RTGS', 'IMPS', 'UPI', 'Deposit', 'Withdrawal'], required: true },
  amount: { type: Number, required: true },
  remarks: { type: String },
  payeeName: { type: String },
  payeeAccount: { type: String },
  ifscCode: { type: String },
  upiId: { type: String },
  category: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  idempotencyKey: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

TransactionSchema.index({ sourceAccount: 1, createdAt: -1 });
TransactionSchema.index({ targetAccount: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
