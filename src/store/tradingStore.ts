import { create } from 'zustand';
import { TradingOrder, TokenPrice } from '../types';

interface TradingState {
  orders: TradingOrder[];
  prices: TokenPrice[];
  orderBook: {
    asks: { price: number; amount: number; total: number }[];
    bids: { price: number; amount: number; total: number }[];
  };
  recentTrades: { price: number; amount: number; time: string; type: 'buy' | 'sell' }[];
  isLoading: boolean;
  
  // Actions
  fetchOrders: (userId: string) => Promise<void>;
  fetchPrices: () => Promise<void>;
  fetchOrderBook: (pair: string) => Promise<void>;
  fetchRecentTrades: (pair: string) => Promise<void>;
  placeOrder: (order: Omit<TradingOrder, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: TradingOrder['status']) => Promise<void>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  orders: [],
  prices: [],
  orderBook: { asks: [], bids: [] },
  recentTrades: [],
  isLoading: false,

  fetchOrders: async (userId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockOrders: TradingOrder[] = [
        {
          id: '1',
          userId,
          pair: 'DCB/USDT',
          type: 'limit',
          side: 'buy',
          amount: 1000,
          price: 0.25,
          status: 'pending',
          createdAt: '2024-01-20T10:00:00Z',
          fees: 2.5
        },
        {
          id: '2',
          userId,
          pair: 'DCB/USDT',
          type: 'market',
          side: 'sell',
          amount: 500,
          status: 'filled',
          createdAt: '2024-01-19T15:30:00Z',
          filledAt: '2024-01-19T15:30:05Z',
          fees: 1.25
        }
      ];
      
      set({ orders: mockOrders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchPrices: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockPrices: TokenPrice[] = [
        {
          symbol: 'DCB',
          price: 0.259,
          change24h: 5.2,
          volume24h: 2400000,
          marketCap: 259000000,
          lastUpdated: new Date().toISOString()
        },
        {
          symbol: 'CO2',
          price: 0.18,
          change24h: 2.8,
          volume24h: 890000,
          marketCap: 18000000,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      set({ prices: mockPrices, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchOrderBook: async (pair: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockOrderBook = {
        asks: [
          { price: 0.262, amount: 15420, total: 4040.04 },
          { price: 0.261, amount: 8950, total: 2335.95 },
          { price: 0.260, amount: 12300, total: 3198.00 },
          { price: 0.259, amount: 6780, total: 1756.02 }
        ],
        bids: [
          { price: 0.258, amount: 9840, total: 2538.72 },
          { price: 0.257, amount: 11200, total: 2878.40 },
          { price: 0.256, amount: 7650, total: 1958.40 },
          { price: 0.255, amount: 13400, total: 3417.00 }
        ]
      };
      
      set({ orderBook: mockOrderBook });
    } catch (error) {
      throw error;
    }
  },

  fetchRecentTrades: async (pair: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockTrades = [
        { price: 0.259, amount: 1250, time: '16:45:23', type: 'buy' as const },
        { price: 0.258, amount: 890, time: '16:45:18', type: 'sell' as const },
        { price: 0.259, amount: 2100, time: '16:45:12', type: 'buy' as const },
        { price: 0.257, amount: 750, time: '16:45:08', type: 'sell' as const },
        { price: 0.258, amount: 1680, time: '16:45:02', type: 'buy' as const }
      ];
      
      set({ recentTrades: mockTrades });
    } catch (error) {
      throw error;
    }
  },

  placeOrder: async (order: Omit<TradingOrder, 'id' | 'createdAt' | 'status'>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: TradingOrder = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: order.type === 'market' ? 'filled' : 'pending',
        filledAt: order.type === 'market' ? new Date().toISOString() : undefined
      };
      
      set(state => ({
        orders: [...state.orders, newOrder],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' as const } : order
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: TradingOrder['status']) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status,
                filledAt: status === 'filled' ? new Date().toISOString() : order.filledAt
              }
            : order
        )
      }));
    } catch (error) {
      throw error;
    }
  }
}));