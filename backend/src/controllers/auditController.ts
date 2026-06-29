import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';

export const createAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, performedBy, resourceType, resourceId, details, severity } = req.body;
    
    // In a real app, ipAddress would come from req.ip
    const ipAddress = req.ip || '127.0.0.1';

    const newLog = new AuditLog({
      action,
      performedBy,
      resourceType,
      resourceId,
      ipAddress,
      details,
      severity
    });

    await newLog.save();

    res.status(201).json({
      success: true,
      message: 'Audit log created successfully',
      data: newLog
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({ success: false, message: 'Failed to create audit log' });
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
};
