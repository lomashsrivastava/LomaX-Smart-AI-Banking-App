import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  limitAmount: number;
  spentAmount: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
}

const BudgetSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limitAmount: { type: Number, required: true },
  spentAmount: { type: Number, default: 0 },
  month: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid duplicate category budgets for same user per month
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', BudgetSchema);
