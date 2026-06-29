import mongoose, { Document, Schema } from 'mongoose';

export interface IBeneficiary extends Document {
  user: mongoose.Types.ObjectId; // Owner of the beneficiary list
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  createdAt: Date;
}

const BeneficiarySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, default: 'LomaX Bank' },
  createdAt: { type: Date, default: Date.now },
});

// Avoid duplicate beneficiaries for the same user
BeneficiarySchema.index({ user: 1, accountNumber: 1 }, { unique: true });

export default mongoose.model<IBeneficiary>('Beneficiary', BeneficiarySchema);
