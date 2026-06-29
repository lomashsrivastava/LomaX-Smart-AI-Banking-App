import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';
import User from '../models/User';
import { registerClient, unregisterClient } from '../services/notificationService';

/**
 * Helper to resolve the MongoDB User _id from AuthenticatedRequest.
 */
const resolveUserId = async (req: AuthenticatedRequest): Promise<string | null> => {
  if (req.user?.id) return req.user.id;
  if (req.user?.customerId) {
    const user = await User.findOne({ customerId: req.user.customerId });
    return user ? String(user._id) : null;
  }
  return null;
};

/**
 * Establish a Server-Sent Events (SSE) stream for the user.
 */
export const streamNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = await resolveUserId(req);
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized connection' });
    return;
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Encoding': 'none',
    'X-Accel-Buffering': 'no' // Prevent proxy buffering (e.g. Nginx)
  });

  // Register client
  registerClient(userId, res);

  // Send initial comment to establish stream
  res.write(': ok\n\n');

  // Keep-alive heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  // Unregister on connection close
  req.on('close', () => {
    clearInterval(heartbeat);
    unregisterClient(userId, res);
    res.end();
  });
};

/**
 * Retrieve recent notifications for the logged-in user.
 */
export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized request' });
      return;
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving notifications' });
  }
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized request' });
      return;
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification status' });
  }
};

/**
 * Mark all user notifications as read.
 */
export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized request' });
      return;
    }

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Server error updating notification list' });
  }
};
