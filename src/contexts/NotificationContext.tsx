import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockSystemAlerts } from '../data/mockData';

interface NotificationItem {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  unreadCount: number;
  acknowledgeNotification: (id: string) => void;
  acknowledgeAll: () => void;
  deleteNotification: (id: string) => void;
  clearRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockSystemAlerts);

  const unreadCount = notifications.filter(n => !n.acknowledged).length;

  const acknowledgeNotification = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, acknowledged: true } : notif
    ));
  };

  const acknowledgeAll = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, acknowledged: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearRead = () => {
    setNotifications(prev => prev.filter(notif => !notif.acknowledged));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        acknowledgeNotification,
        acknowledgeAll,
        deleteNotification,
        clearRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
