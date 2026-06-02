import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone: string;
  fullName: string;
  avatarUrl?: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  trustScore: number;
  preferences: {
    theme: string;
    animationIntensity: string;
    holographicMode: string;
    language: string;
    notificationsEnabled: boolean;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  fullName: { type: String, required: true },
  avatarUrl: { type: String },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected', 'expired'], default: 'pending' },
  trustScore: { type: Number, default: 500 },
  preferences: {
    theme: { type: String, default: 'dark' },
    animationIntensity: { type: String, default: 'medium' },
    holographicMode: { type: String, default: 'galaxy' },
    language: { type: String, default: 'en' },
    notificationsEnabled: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
