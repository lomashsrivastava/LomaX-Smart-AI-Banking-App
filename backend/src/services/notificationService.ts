import { Response } from 'express';
import Notification from '../models/Notification';

// Map of userId -> active SSE response streams
const activeClients = new Map<string, Response[]>();

/**
 * Register a client's response stream for live Server-Sent Events (SSE).
 */
export const registerClient = (userId: string, res: Response) => {
  const clients = activeClients.get(userId) || [];
  clients.push(res);
  activeClients.set(userId, clients);
  console.log(`[SSE] Client registered for user: ${userId}. Active streams: ${clients.length}`);
};

/**
 * Unregister a client's response stream.
 */
export const unregisterClient = (userId: string, res: Response) => {
  const clients = activeClients.get(userId) || [];
  const index = clients.indexOf(res);
  if (index !== -1) {
    clients.splice(index, 1);
  }
  if (clients.length === 0) {
    activeClients.delete(userId);
  } else {
    activeClients.set(userId, clients);
  }
  console.log(`[SSE] Client disconnected for user: ${userId}. Active streams: ${clients.length}`);
};

/**
 * Create a new notification, persist it to the database,
 * and push it in real time to any active SSE streams for the user.
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'system' = 'info'
) => {
  try {
    const newNotification = new Notification({
      user: userId,
      title,
      message,
      type
    });

    await newNotification.save();
    console.log(`[Notification] Saved for ${userId}: "${title}"`);

    // Stream live to active clients if connected
    const clients = activeClients.get(userId);
    if (clients && clients.length > 0) {
      const payload = JSON.stringify({
        success: true,
        notification: {
          id: newNotification._id,
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          read: newNotification.read,
          createdAt: newNotification.createdAt
        }
      });

      clients.forEach(res => {
        try {
          res.write(`event: notification\n`);
          res.write(`data: ${payload}\n\n`);
        } catch (err) {
          console.error(`[SSE] Error streaming to user ${userId}:`, err);
        }
      });
    }

    return newNotification;
  } catch (error) {
    console.error('[Notification] Error creating notification:', error);
  }
};
