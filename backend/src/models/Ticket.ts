import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  ticketId: string;
  customerId: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  description: string;
  assignedTo?: string; // Employee ID
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  description: { type: String, required: true },
  assignedTo: { type: String },
}, { timestamps: true });

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
