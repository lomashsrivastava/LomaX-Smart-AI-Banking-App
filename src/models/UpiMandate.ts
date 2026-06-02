import mongoose, { Schema, Document } from 'mongoose';

export interface IUpiMandate extends Document {
  userId: mongoose.Types.ObjectId;
  merchantName: string;
  merchantUpiId: string;
  accountId: mongoose.Types.ObjectId;
  maxAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'as-presented';
  status: 'active' | 'paused' | 'revoked' | 'completed';
  nextDebitDate?: Date;
  aiInsights?: string;
  createdAt: Date;
}

const UpiMandateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  merchantName: { type: String, required: true },
  merchantUpiId: { type: String, required: true },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  maxAmount: { type: Number, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'as-presented'], default: 'monthly' },
  status: { type: String, enum: ['active', 'paused', 'revoked', 'completed'], default: 'active' },
  nextDebitDate: { type: Date },
  aiInsights: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UpiMandate || mongoose.model<IUpiMandate>('UpiMandate', UpiMandateSchema);
