import mongoose, { Document, Schema } from 'mongoose';

export interface ISavingsGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  category?: string;
  status: 'active' | 'achieved' | 'cancelled';
  createdAt: Date;
}

const SavingsGoalSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['active', 'achieved', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);
