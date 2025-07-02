import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId,
          type: 'success',
          title: 'KYC Onaylandı',
          message: 'KYC başvurunuz başarıyla onaylandı. Artık tüm özellikleri kullanabilirsiniz.',
          read: false,
          createdAt: '2024-01-20T10:00:00Z',
          actionUrl: '/profile'
        },
        {
          id: '2',
          userId,
          type: 'info',
          title: 'Yeni Proje',
          message: 'Amazon Orman Koruma projesi yatırıma açıldı.',
          read: false,
          createdAt: '2024-01-19T15:30:00Z',
          actionUrl: '/projects/1'
        },
        {
          id: '3',
          userId,
          type: 'warning',
          title: 'Staking Süresi Doluyor',
          message: 'DCB staking pozisyonunuz 3 gün içinde sona erecek.',
          read: true,
          createdAt: '2024-01-18T09:15:00Z',
          actionUrl: '/staking'
        }
      ];
      
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      
      set({ notifications: mockNotifications, unreadCount, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => {
        const updatedNotifications = state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return { notifications: updatedNotifications, unreadCount };
      });
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        notifications: state.notifications.map(n =>
          n.userId === userId ? { ...n, read: true } : n
        ),
        unreadCount: 0
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => {
        const updatedNotifications = state.notifications.filter(n => n.id !== notificationId);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return { notifications: updatedNotifications, unreadCount };
      });
    } catch (error) {
      throw error;
    }
  },

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + (newNotification.read ? 0 : 1)
      }));
    } catch (error) {
      throw error;
    }
  }
}));