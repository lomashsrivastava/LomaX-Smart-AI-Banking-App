import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  priority: number;
  status: 'active' | 'completed' | 'paused';
  color: string;
  aiStrategy?: string;
  predictedCompletionDate?: Date;
  createdAt: Date;
}

const GoalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  priority: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  color: { type: String, default: '#00e5ff' },
  aiStrategy: { type: String },
  predictedCompletionDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
