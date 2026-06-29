import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: string;
  cifNumber: string;
  user: mongoose.Types.ObjectId;
  accountType: 'Savings Account' | 'Current Account' | 'Salary Account' | 'Fixed Deposit' | 'Recurring Deposit';
  balance: number;
  branchName: string;
  branchCode: string;
  ifscCode: string;
  status: 'active' | 'dormant' | 'closed';
  services: {
    debitCard: boolean;
    internetBanking: boolean;
    mobileBanking: boolean;
    smsAlerts: boolean;
    chequeBook: boolean;
    upi: boolean;
  };
  createdAt: Date;
}

const AccountSchema: Schema = new Schema({
  accountNumber: { type: String, required: true, unique: true },
  cifNumber: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accountType: { type: String, required: true },
  balance: { type: Number, default: 0 },
  branchName: { type: String, required: true },
  branchCode: { type: String, required: true },
  ifscCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'dormant', 'closed'], default: 'active' },
  services: {
    debitCard: { type: Boolean, default: false },
    internetBanking: { type: Boolean, default: false },
    mobileBanking: { type: Boolean, default: false },
    smsAlerts: { type: Boolean, default: false },
    chequeBook: { type: Boolean, default: false },
    upi: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAccount>('Account', AccountSchema);
