import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions {
  table: string;
  event?: RealtimeEvent;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

export const useRealtimeSubscription = (options: UseRealtimeOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        channel = supabase.channel(`realtime:${options.table}`);

        const config: any = {
          event: options.event || '*',
          schema: 'public',
          table: options.table
        };

        if (options.filter) {
          config.filter = options.filter;
        }

        channel
          .on('postgres_changes', config, (payload) => {
            if (payload.eventType === 'INSERT' && options.onInsert) {
              options.onInsert(payload.new);
            } else if (payload.eventType === 'UPDATE' && options.onUpdate) {
              options.onUpdate(payload.new);
            } else if (payload.eventType === 'DELETE' && options.onDelete) {
              options.onDelete(payload.old);
            }

            if (options.onChange) {
              options.onChange(payload);
            }
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              setError(null);
            } else if (status === 'CHANNEL_ERROR') {
              setError('Failed to connect to realtime channel');
              setIsConnected(false);
            } else if (status === 'TIMED_OUT') {
              setError('Connection timed out');
              setIsConnected(false);
            } else if (status === 'CLOSED') {
              setIsConnected(false);
            }
          });
      } catch (err: any) {
        setError(err.message);
        setIsConnected(false);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [options.table, options.event, options.filter]);

  return { isConnected, error };
};

export const useProjectsRealtime = (callback: (project: any) => void) => {
  return useRealtimeSubscription({
    table: 'projects',
    onChange: callback
  });
};

export const useBlogPostsRealtime = (callback: (post: any) => void) => {
  return useRealtimeSubscription({
    table: 'blog_posts',
    onChange: callback
  });
};

export const useInvestmentsRealtime = (userId: string, callback: (investment: any) => void) => {
  return useRealtimeSubscription({
    table: 'investments',
    filter: `user_id=eq.${userId}`,
    onChange: callback
  });
};

export const useNotificationsRealtime = (userId: string, callback: (notification: any) => void) => {
  return useRealtimeSubscription({
    table: 'notifications',
    filter: `user_id=eq.${userId}`,
    onInsert: callback
  });
};

export const useTransactionsRealtime = (userId: string, callback: (transaction: any) => void) => {
  return useRealtimeSubscription({
    table: 'transactions',
    filter: `user_id=eq.${userId}`,
    onChange: callback
  });
};

export const useKYCApplicationsRealtime = (callback: (application: any) => void) => {
  return useRealtimeSubscription({
    table: 'kyc_applications',
    onChange: callback
  });
};

export const useStakingPositionsRealtime = (userId: string, callback: (position: any) => void) => {
  return useRealtimeSubscription({
    table: 'staking_positions',
    filter: `user_id=eq.${userId}`,
    onChange: callback
  });
};
