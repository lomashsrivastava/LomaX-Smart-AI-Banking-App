import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  applicationId: string;
  customerId: string; // The person applying
  loanType: 'Home Loan' | 'Personal Loan' | 'Car Loan' | 'Education Loan';
  amount: number;
  tenureMonths: number;
  interestRate: number;
  purpose: string;
  monthlyIncome: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Closed';
  appliedAt: Date;
  approvedAt?: Date;
}

const LoanSchema: Schema = new Schema({
  applicationId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  loanType: { type: String, enum: ['Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan'], required: true },
  amount: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  purpose: { type: String, required: true },
  monthlyIncome: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Closed'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
}, { timestamps: true });

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);
