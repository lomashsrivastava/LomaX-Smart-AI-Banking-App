import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  cardNumber: string;
  accountNumber: string;
  cardHolderName: string;
  cardType: 'Debit' | 'Credit';
  cardNetwork: 'Visa' | 'MasterCard' | 'RuPay';
  expiryDate: string; // MM/YY
  cvv: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  issueDate: Date;
  dailyLimit: number;
  isInternational: boolean;
  isOnline: boolean;
  isContactless: boolean;
  pin: string;
}

const CardSchema: Schema = new Schema({
  cardNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  cardType: { type: String, enum: ['Debit', 'Credit'], required: true },
  cardNetwork: { type: String, enum: ['Visa', 'MasterCard', 'RuPay'], required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Blocked'], default: 'Active' },
  issueDate: { type: Date, default: Date.now },
  dailyLimit: { type: Number, default: 50000 },
  isInternational: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: true },
  isContactless: { type: Boolean, default: false },
  pin: { type: String, default: "1234" },
}, { timestamps: true });

export const Card = mongoose.model<ICard>('Card', CardSchema);
