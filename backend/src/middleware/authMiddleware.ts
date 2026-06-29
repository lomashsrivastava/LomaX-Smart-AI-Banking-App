import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuditLog } from '../models/AuditLog';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lomax_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // MongoDB User _id
    role: string;
    customerId: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // Also check cookies
  const cookieToken = req.cookies && (req.cookies.token || req.cookies.refreshToken);

  const actualToken = token || cookieToken;

  if (!actualToken) {
    // Fallback to customerId in query, params, or body to maintain backward compatibility
    const customerId = req.query?.customerId || req.body?.customerId || req.params?.customerId;
    if (customerId) {
      req.user = { id: '', role: 'customer', customerId: String(customerId) };
      return next();
    }
    res.status(401).json({ success: false, message: 'Access denied. Authentication required.' });
    return;
  }

  try {
    const decoded = jwt.verify(actualToken, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      customerId: decoded.customerId
    };
    next();
  } catch (err) {
    // Fallback to customerId in query, params, or body to maintain backward compatibility if token validation fails
    const customerId = req.query?.customerId || req.body?.customerId || req.params?.customerId;
    if (customerId) {
      req.user = { id: '', role: 'customer', customerId: String(customerId) };
      return next();
    }
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`[LomaX RBAC] Unauthorized access attempt by ${req.user.customerId || 'Unknown'} (role: ${req.user.role}) trying to access ${req.originalUrl}`);
      try {
        const log = new AuditLog({
          action: 'Unauthorized Access Attempt',
          performedBy: req.user.customerId || 'anonymous',
          resourceType: 'API Route',
          resourceId: req.originalUrl,
          ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
          details: `Role ${req.user.role} attempted to access route requiring one of [${allowedRoles.join(', ')}]`,
          severity: 'Critical'
        });
        await log.save();
      } catch (err) {
        console.error('Failed to log RBAC warning to AuditLog:', err);
      }

      res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};
