import { create } from 'zustand';
import { StakingPool, StakingPosition } from '../types';

interface StakingState {
  pools: StakingPool[];
  positions: StakingPosition[];
  isLoading: boolean;
  
  // Actions
  fetchStakingPools: () => Promise<void>;
  fetchUserPositions: (userId: string) => Promise<void>;
  stakeTokens: (poolId: string, amount: number, userId: string) => Promise<void>;
  unstakeTokens: (positionId: string) => Promise<void>;
  claimRewards: (positionId: string) => Promise<void>;
  createStakingPool: (pool: Omit<StakingPool, 'id'>) => Promise<void>;
  updateStakingPool: (poolId: string, updates: Partial<StakingPool>) => Promise<void>;
}

export const useStakingStore = create<StakingState>((set, get) => ({
  pools: [],
  positions: [],
  isLoading: false,

  fetchStakingPools: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPools: StakingPool[] = [
        {
          id: '1',
          name: 'DCB Staking Pool',
          tokenSymbol: 'DCB',
          apy: 12.5,
          minimumStake: 100,
          lockPeriod: 30,
          totalStaked: 5000000,
          participants: 1247,
          status: 'active',
          description: 'Stake your DCB tokens and earn rewards'
        },
        {
          id: '2',
          name: 'Carbon Credit Pool',
          tokenSymbol: 'CO2',
          apy: 8.7,
          minimumStake: 50,
          lockPeriod: 90,
          totalStaked: 2500000,
          participants: 892,
          status: 'active',
          description: 'Stake carbon credits for long-term rewards'
        },
        {
          id: '3',
          name: 'High Yield Pool',
          tokenSymbol: 'DCB',
          apy: 18.2,
          minimumStake: 1000,
          lockPeriod: 180,
          totalStaked: 1200000,
          participants: 234,
          status: 'active',
          description: 'High APY pool with longer lock period'
        }
      ];
      
      set({ pools: mockPools, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUserPositions: async (userId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPositions: StakingPosition[] = [
        {
          id: '1',
          userId,
          poolId: '1',
          amount: 5000,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T00:00:00Z',
          status: 'active',
          rewards: 52.08,
          lastRewardClaim: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          userId,
          poolId: '2',
          amount: 2500,
          startDate: '2023-12-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z',
          status: 'active',
          rewards: 145.83
        }
      ];
      
      set({ positions: mockPositions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  stakeTokens: async (poolId: string, amount: number, userId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pool = get().pools.find(p => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      
      const newPosition: StakingPosition = {
        id: Date.now().toString(),
        userId,
        poolId,
        amount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + pool.lockPeriod * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        rewards: 0
      };
      
      set(state => ({
        positions: [...state.positions, newPosition],
        pools: state.pools.map(p =>
          p.id === poolId
            ? { ...p, totalStaked: p.totalStaked + amount, participants: p.participants + 1 }
            : p
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  unstakeTokens: async (positionId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        positions: state.positions.map(p =>
          p.id === positionId ? { ...p, status: 'withdrawn' as const } : p
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  claimRewards: async (positionId: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        positions: state.positions.map(p =>
          p.id === positionId
            ? { ...p, rewards: 0, lastRewardClaim: new Date().toISOString() }
            : p
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createStakingPool: async (pool: Omit<StakingPool, 'id'>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPool: StakingPool = {
        ...pool,
        id: Date.now().toString()
      };
      
      set(state => ({
        pools: [...state.pools, newPool],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateStakingPool: async (poolId: string, updates: Partial<StakingPool>) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        pools: state.pools.map(p => p.id === poolId ? { ...p, ...updates } : p),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));