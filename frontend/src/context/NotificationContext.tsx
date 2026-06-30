"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import apiClient from "@/services/api-client";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'system';
  read: boolean;
  createdAt: string;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await apiClient.get("/notifications");
      if (res.data.success && res.data.notifications) {
        // Map _id to id
        const mapped = res.data.notifications.map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt
        }));
        setNotifications(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch notifications list:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await apiClient.patch(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await apiClient.post("/notifications/read-all");
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    let apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
          apiBase = "https://lomax-backend.onrender.com/api";
        }
      }
    }
    if (!apiBase) {
      apiBase = "http://localhost:5000/api";
    }
    // Append customerId query fallback for dev environments
    const sseUrl = `${apiBase}/notifications/stream?customerId=${user.id}`;
    
    console.log("[SSE] Connecting to notification stream:", sseUrl);
    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success && data.notification) {
          const newNotification: NotificationItem = {
            id: data.notification.id,
            title: data.notification.title,
            message: data.notification.message,
            type: data.notification.type,
            read: data.notification.read,
            createdAt: data.notification.createdAt
          };

          // Prepend new notification
          setNotifications(prev => [newNotification, ...prev]);

          // Trigger toast alert based on notification type
          const options = {
            description: newNotification.message,
            duration: 5000,
          };
          
          if (newNotification.type === "success" || newNotification.type === "transaction") {
            toast.success(newNotification.title, options);
          } else if (newNotification.type === "error") {
            toast.error(newNotification.title, options);
          } else if (newNotification.type === "warning") {
            toast.warning(newNotification.title, options);
          } else {
            toast.info(newNotification.title, options);
          }
        }
      } catch (err) {
        console.error("[SSE] Failed to parse event payload:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("[SSE] Stream connection error:", err);
    };

    return () => {
      console.log("[SSE] Closing notification stream connection");
      eventSource.close();
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
