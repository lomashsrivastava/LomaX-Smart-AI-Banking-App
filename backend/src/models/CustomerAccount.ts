import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerAccount extends Document {
  // Customer Info
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  plainPassword: string; // temp password shown to admin after approval

  // Account Info
  accountNumber: string;
  accountType: string;
  initialDeposit: number;
  branchId?: string;
  branchName: string;
  branchCode: string;
  ifscCode: string;

  // Services
  services: {
    debitCard: boolean;
    internetBanking: boolean;
    mobileBanking: boolean;
    smsAlerts: boolean;
    chequeBook: boolean;
    upi: boolean;
  };

  // Workflow
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Full registration data for reference
  registrationData: any;

  // Reference to created User and Account after approval
  userId?: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId;

  createdAt: Date;
}

const CustomerAccountSchema: Schema = new Schema({
  customerId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, default: '' },
  pan: { type: String, default: '' },
  aadhaar: { type: String, default: '' },
  plainPassword: { type: String, required: true },

  accountNumber: { type: String, required: true },
  accountType: { type: String, default: 'Savings Account' },
  initialDeposit: { type: Number, default: 0 },
  branchId: { type: String },
  branchName: { type: String, default: 'Head Office' },
  branchCode: { type: String, default: 'HO001' },
  ifscCode: { type: String, default: 'LOMX0000001' },

  services: {
    debitCard: { type: Boolean, default: true },
    internetBanking: { type: Boolean, default: false },
    mobileBanking: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    chequeBook: { type: Boolean, default: false },
    upi: { type: Boolean, default: false },
  },

  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectionReason: { type: String },

  registrationData: { type: Schema.Types.Mixed },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account' },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomerAccount>('CustomerAccount', CustomerAccountSchema);
