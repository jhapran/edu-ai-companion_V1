import { useState, useCallback, useEffect } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
}

export interface UseNotificationReturn {
  notifications: Notification[];
  showNotification: (message: string, options?: NotificationOptions) => string;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  clearNotificationsByType: (type: NotificationType) => void;
  success: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  error: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  info: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
}

const DEFAULT_DURATION = 5000; // 5 seconds
const MAX_NOTIFICATIONS = 5;

const useNotification = (): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const showNotification = useCallback((message: string, options: NotificationOptions = {}): string => {
    const id = generateId();
    const notification: Notification = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration ?? DEFAULT_DURATION,
      dismissible: options.dismissible ?? true,
      action: options.action,
      metadata: options.metadata,
      createdAt: Date.now(),
    };

    setNotifications(prev => {
      const updated = [notification, ...prev];
      // Limit the number of notifications
      return updated.slice(0, MAX_NOTIFICATIONS);
    });

    return id;
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, ...updates }
          : notification
      )
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearNotificationsByType = useCallback((type: NotificationType) => {
    setNotifications(prev =>
      prev.filter(notification => notification.type !== type)
    );
  }, []);

  // Auto-dismiss notifications based on duration
  useEffect(() => {
    const timeouts = notifications
      .filter(notification => notification.duration && notification.duration > 0)
      .map(notification => ({
        id: notification.id,
        timeout: setTimeout(() => {
          dismissNotification(notification.id);
        }, notification.duration)
      }));

    return () => {
      timeouts.forEach(({ timeout }) => clearTimeout(timeout));
    };
  }, [notifications, dismissNotification]);

  // Helper functions for common notification types
  const success = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return showNotification(message, { ...options, type: 'success' });
  }, [showNotification]);

  const error = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return showNotification(message, { ...options, type: 'error' });
  }, [showNotification]);

  const warning = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return showNotification(message, { ...options, type: 'warning' });
  }, [showNotification]);

  const info = useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return showNotification(message, { ...options, type: 'info' });
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    updateNotification,
    dismissNotification,
    clearNotifications,
    clearNotificationsByType,
    success,
    error,
    warning,
    info,
  };
};

export default useNotification;
