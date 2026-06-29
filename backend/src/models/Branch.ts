import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  branchId: string;
  branchCode: string;
  branchName: string;
  ifscCode: string;
  micrCode: string;
  country: string;
  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerName: string;
  openingDate: Date;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema: Schema = new Schema({
  branchId: { type: String, required: true, unique: true },
  branchCode: { type: String, required: true, unique: true },
  branchName: { type: String, required: true },
  ifscCode: { type: String, required: true, unique: true },
  micrCode: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  managerName: { type: String, required: true },
  openingDate: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, {
  timestamps: true
});

export const Branch = mongoose.model<IBranch>('Branch', BranchSchema);
