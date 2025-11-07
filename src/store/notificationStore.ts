import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Notification } from '../types';
import toast from 'react-hot-toast';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

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
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifications: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.created_at,
        actionUrl: n.action_url
      }));

      const unreadCount = notifications.filter(n => !n.read).length;

      set({ notifications, unreadCount, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      set(state => {
        const updatedNotifications = state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updatedNotifications.filter(n => !n.read).length;

        return { notifications: updatedNotifications, unreadCount };
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      set(state => ({
        notifications: state.notifications.map(n =>
          n.userId === userId ? { ...n, read: true } : n
        ),
        unreadCount: 0
      }));

      toast.success('Tüm bildirimler okundu olarak işaretlendi');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      toast.error('Bildirimler güncellenemedi');
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      set(state => {
        const updatedNotifications = state.notifications.filter(n => n.id !== notificationId);
        const unreadCount = updatedNotifications.filter(n => !n.read).length;

        return { notifications: updatedNotifications, unreadCount };
      });

      toast.success('Bildirim silindi');
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error('Bildirim silinemedi');
    }
  },

  createNotification: async (notificationData) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          read: false,
          action_url: notificationData.actionUrl,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const newNotification: Notification = {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        read: data.read,
        createdAt: data.created_at,
        actionUrl: data.action_url
      };

      set(state => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }));
    } catch (error: any) {
      console.error('Error creating notification:', error);
    }
  }
}));
