import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  customerId: string;
  password?: string;
  role: 'admin' | 'customer';
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  pan: string;
  aadhaar: string;
  status: 'pending' | 'active' | 'rejected';
  registrationData?: any;
  createdAt: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  passwordHistory?: string[];
  activeSessions: Array<{
    sessionId: string;
    deviceName: string;
    browser: string;
    ipAddress: string;
    location: string;
    refreshToken?: string;
    lastUsed: Date;
  }>;
}

const UserSchema: Schema = new Schema({
  customerId: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed password
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  pan: { type: String, required: true },
  aadhaar: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  registrationData: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  twoFactorBackupCodes: { type: [String], default: [] },
  failedLoginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date },
  passwordHistory: { type: [String], default: [] },
  activeSessions: {
    type: [{
      sessionId: { type: String, required: true },
      deviceName: { type: String, default: 'Unknown' },
      browser: { type: String, default: 'Unknown' },
      ipAddress: { type: String, default: '127.0.0.1' },
      location: { type: String, default: 'Local' },
      refreshToken: { type: String },
      lastUsed: { type: Date, default: Date.now }
    }],
    default: []
  }
});

export default mongoose.model<IUser>('User', UserSchema);
