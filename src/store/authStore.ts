import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'tr' | 'en';
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setLanguage: (language: 'tr' | 'en') => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  enable2FA: () => Promise<string>; // Returns QR code
  verify2FA: (code: string) => Promise<void>;
  disable2FA: (code: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      language: 'tr',

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data based on email
          let mockUser: User;
          
          if (email.includes('superadmin')) {
            mockUser = {
              id: '1',
              email,
              name: 'Super Admin',
              role: 'superadmin',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString()
            };
          } else if (email.includes('admin')) {
            mockUser = {
              id: '2',
              email,
              name: 'Admin User',
              role: 'admin',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString()
            };
          } else if (email.includes('advisor')) {
            mockUser = {
              id: '4',
              email,
              name: 'Advisor User',
              role: 'advisor',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString(),
              specializations: ['Carbon Credits', 'Sustainability', 'Investment Advisory'],
              assignedUsers: []
            };
          } else if (email.includes('verification')) {
            mockUser = {
              id: '5',
              email,
              name: 'Verification Organization',
              role: 'verification_org',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString(),
              organizationName: 'Carbon Trust International',
              organizationType: 'Verification Body',
              certifications: ['ISO 14064', 'VCS', 'Gold Standard']
            };
          } else if (email.includes('ngo')) {
            mockUser = {
              id: '6',
              email,
              name: 'NGO Representative',
              role: 'ngo',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString(),
              organizationName: 'Green Future Foundation',
              organizationType: 'Non-Governmental Organization'
            };
          } else if (email.includes('provider')) {
            mockUser = {
              id: '7',
              email,
              name: 'Carbon Provider',
              role: 'carbon_provider',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'approved',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString(),
              organizationName: 'EcoCarbon Solutions',
              organizationType: 'Carbon Credit Provider'
            };
          } else {
            mockUser = {
              id: '3',
              email,
              name: 'Demo User',
              role: 'user',
              createdAt: new Date().toISOString(),
              isActive: true,
              kycStatus: 'pending',
              walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF31d2',
              language: get().language,
              twoFactorEnabled: false,
              emailVerified: true,
              lastLogin: new Date().toISOString()
            };
          }

          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (userData: Partial<User>) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: Date.now().toString(),
            email: userData.email!,
            name: userData.name!,
            role: 'user',
            createdAt: new Date().toISOString(),
            isActive: true,
            kycStatus: 'pending',
            language: get().language,
            twoFactorEnabled: false,
            emailVerified: false
          };

          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setLanguage: (language: 'tr' | 'en') => {
        set({ language });
        const { user } = get();
        if (user) {
          set({ user: { ...user, language } });
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { user } = get();
          if (user) {
            set({ user: { ...user, emailVerified: true }, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      enable2FA: async (): Promise<string> => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Return mock QR code data
          const qrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          set({ isLoading: false });
          return qrCode;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verify2FA: async (code: string) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const { user } = get();
          if (user) {
            set({ user: { ...user, twoFactorEnabled: true }, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      disable2FA: async (code: string) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const { user } = get();
          if (user) {
            set({ user: { ...user, twoFactorEnabled: false }, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        language: state.language
      })
    }
  )
);