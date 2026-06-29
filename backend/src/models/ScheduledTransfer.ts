import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledTransfer extends Document {
  user: mongoose.Types.ObjectId;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  payeeName: string;
  ifscCode?: string;
  amount: number;
  remarks?: string;
  transferMode: 'Own Account Transfer' | 'Internal Transfer' | 'NEFT' | 'RTGS' | 'IMPS' | 'UPI';
  scheduleType: 'one-time' | 'recurring';
  frequency?: 'daily' | 'weekly' | 'monthly';
  scheduledDate?: Date; // For one-time future transfers
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  nextRunDate?: Date; // For recurring transfers
  createdAt: Date;
}

const ScheduledTransferSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sourceAccountNumber: { type: String, required: true },
  targetAccountNumber: { type: String, required: true },
  payeeName: { type: String, required: true },
  ifscCode: { type: String },
  amount: { type: Number, required: true },
  remarks: { type: String },
  transferMode: { 
    type: String, 
    enum: ['Own Account Transfer', 'Internal Transfer', 'NEFT', 'RTGS', 'IMPS', 'UPI'], 
    required: true 
  },
  scheduleType: { type: String, enum: ['one-time', 'recurring'], required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
  scheduledDate: { type: Date },
  status: { type: String, enum: ['pending', 'completed', 'cancelled', 'failed'], default: 'pending' },
  nextRunDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IScheduledTransfer>('ScheduledTransfer', ScheduledTransferSchema);
