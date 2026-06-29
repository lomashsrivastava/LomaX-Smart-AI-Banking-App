import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  performedBy: string; // User ID / Name
  resourceType: string;
  resourceId?: string;
  ipAddress: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String },
  ipAddress: { type: String, required: true },
  details: { type: String, required: true },
  severity: { type: String, enum: ['Info', 'Warning', 'Critical'], default: 'Info' },
}, { timestamps: true });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
