import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  accountType: 'savings' | 'current' | 'joint' | 'business' | 'premium' | 'children';
  accountNumber: string;
  ifscCode: string;
  balance: number;
  currency: string;
  interestRate: number;
  status: 'nebula' | 'active' | 'dormant' | 'frozen' | 'archived';
  openingDate: Date;
  healthScore: number;
  color: string;
}

const AccountSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountType: { type: String, enum: ['savings', 'current', 'joint', 'business', 'premium', 'children'], required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, default: 'INR' },
  interestRate: { type: Number, default: 0 },
  status: { type: String, enum: ['nebula', 'active', 'dormant', 'frozen', 'archived'], default: 'active' },
  openingDate: { type: Date, default: Date.now },
  healthScore: { type: Number, default: 100 },
  color: { type: String, default: '#00e5ff' },
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
