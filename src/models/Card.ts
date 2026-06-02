import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardType: 'physical' | 'virtual' | 'tokenized';
  cardNetwork: 'visa' | 'mastercard' | 'rupay' | 'amex';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  status: 'active' | 'frozen' | 'expired' | 'closed';
  currentCvv: string;
  limits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
  geoControls: string[];
  merchantControls: {
    allowed: string[];
    blocked: string[];
  };
  onlineEnabled: boolean;
  internationalEnabled: boolean;
  nightLockEnabled: boolean;
  designTheme: string;
  lastUsedAt: Date;
  createdAt: Date;
}

const CardSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cardType: { type: String, enum: ['physical', 'virtual', 'tokenized'], required: true },
  cardNetwork: { type: String, enum: ['visa', 'mastercard', 'rupay', 'amex'], required: true },
  lastFour: { type: String, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  status: { type: String, enum: ['active', 'frozen', 'expired', 'closed'], default: 'active' },
  currentCvv: { type: String, required: true },
  limits: {
    daily: { type: Number, default: 100000 },
    monthly: { type: Number, default: 500000 },
    perTransaction: { type: Number, default: 50000 },
  },
  geoControls: [{ type: String }],
  merchantControls: {
    allowed: [{ type: String }],
    blocked: [{ type: String }],
  },
  onlineEnabled: { type: Boolean, default: true },
  internationalEnabled: { type: Boolean, default: false },
  nightLockEnabled: { type: Boolean, default: false },
  designTheme: { type: String, default: 'galaxy-nebula' },
  lastUsedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
