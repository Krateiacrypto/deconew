import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';
import { authApi } from '../services/api/authApi';
import { setSentryUser, clearSentryUser, setSentryContext } from '../lib/sentry';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'tr' | 'en' | 'de' | 'fr';
  _hasHydrated: boolean;
  requires2FA: boolean; // NEW: Flag for 2FA requirement
  pending2FAEmail: string | null; // NEW: Email for pending 2FA verification

  login: (email: string, password: string) => Promise<void>;
  loginWith2FA: (email: string, password: string, token: string, isBackupCode?: boolean) => Promise<void>; // NEW
  logout: () => Promise<void>;
  clearStore: () => void;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setLanguage: (language: 'tr' | 'en' | 'de' | 'fr') => void;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  enable2FA: () => Promise<string>;
  verify2FA: (code: string) => Promise<void>;
  disable2FA: (code: string) => Promise<void>;
  checkSession: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
}

const convertDbUserToUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    avatar: dbUser.avatar,
    createdAt: dbUser.created_at,
    isActive: dbUser.is_active,

    // KYC Information
    kycStatus: dbUser.kyc_status,
    kycLevel: dbUser.kyc_level || 'level_1',

    // Investor Tier
    investorTier: dbUser.investor_tier,
    minimumInvestment: dbUser.minimum_investment,
    monthlyLimit: dbUser.monthly_limit,
    tradingFeeRate: dbUser.trading_fee_rate,
    stakingMultiplier: dbUser.staking_multiplier,
    tierUpgradedAt: dbUser.tier_upgraded_at,
    tierBenefits: dbUser.tier_benefits,

    // Contact & Location
    walletAddress: dbUser.wallet_address,
    phone: dbUser.phone,
    country: dbUser.country,
    language: dbUser.language,

    // Security
    twoFactorEnabled: dbUser.two_factor_enabled,
    lastLogin: dbUser.last_login,
    emailVerified: dbUser.email_verified,

    // Organization Details
    organizationName: dbUser.organization_name,
    organizationType: dbUser.organization_type,
    verificationLevel: dbUser.verification_level,

    // Role-specific
    assignedUsers: dbUser.assigned_users,
    specializations: dbUser.specializations,
    certifications: dbUser.certifications
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      language: 'tr',
      _hasHydrated: false,
      requires2FA: false,
      pending2FAEmail: null,

      checkSession: async () => {
        try {
          // Check if JWT token exists in localStorage
          const token = localStorage.getItem('access_token');

          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          // Validate token by fetching current user from backend
          try {
            await get().fetchUserProfile();
          } catch (profileError) {
            logger.error('Profile fetch failed during session check', profileError);
            // Token might be expired or invalid
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          logger.error('Session check failed', error);
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchUserProfile: async () => {
        try {
          // Fetch current user from backend using JWT token
          const userData = await authApi.getCurrentUser();

          const user = convertDbUserToUser({
            id: userData.id,
            email: userData.email,
            name: `${userData.first_name} ${userData.last_name}`,
            role: 'user',
            created_at: userData.created_at,
            is_active: true,
            kyc_status: userData.kyc_status,
            kyc_level: userData.kyc_level,
            two_factor_enabled: userData.two_factor_enabled || false,
            email_verified: true,
            language: userData.language,
            country: userData.country,
            organization_name: userData.organization_name,
            organization_type: userData.organization_type,
          });

          set({ user, isAuthenticated: true });

          // Set Sentry user context
          setSentryUser({
            id: user.id,
            email: user.email,
            username: user.name,
            role: user.role,
          });

          logger.info('User profile loaded', { userId: user.id });
        } catch (error: any) {
          logger.error('Failed to fetch user profile', error);
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Use backend MySQL auth exclusively
          const response = await authApi.login({ email, password });

          // Check if 2FA is required
          if (response.requires2FA) {
            logger.info('2FA required for login', { email });
            set({
              isLoading: false,
              requires2FA: true,
              pending2FAEmail: email,
            });
            toast('İki faktörlü doğrulama gerekli', {
              icon: '🔐',
            });
            return;
          }

          // No 2FA - complete login
          const user = convertDbUserToUser({
            id: response.user.id,
            email: response.user.email,
            name: `${response.user.first_name} ${response.user.last_name}`,
            role: 'user',
            created_at: response.user.created_at,
            is_active: true,
            kyc_status: response.user.kyc_status,
            kyc_level: response.user.kyc_level,
            two_factor_enabled: response.user.two_factor_enabled || false,
            email_verified: true,
            language: response.user.language,
            country: response.user.country,
            organization_name: response.user.organization_name,
            organization_type: response.user.organization_type,
          });

          // Set Sentry user context
          setSentryUser({
            id: user.id,
            email: user.email,
            username: user.name,
            role: user.role,
          });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
            pending2FAEmail: null,
          });

          logger.info('Login successful', { email, userId: user.id });
          toast.success('Giriş başarılı!');
        } catch (error: any) {
          logger.error('Login failed', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            requires2FA: false,
            pending2FAEmail: null
          });

          const errorMessage = error.message === 'Invalid login credentials'
            ? 'Email veya şifre hatalı!'
            : error.message || 'Giriş başarısız!';
          toast.error(errorMessage);
          throw error;
        }
      },

      loginWith2FA: async (email: string, password: string, token: string, isBackupCode = false) => {
        set({ isLoading: true });
        try {
          const response = await authApi.loginWith2FA({
            email,
            password,
            token,
            isBackupCode,
          });

          // Convert backend user to frontend user format
          const user = convertDbUserToUser({
            id: response.user.id,
            email: response.user.email,
            name: `${response.user.first_name} ${response.user.last_name}`,
            role: 'user',
            created_at: response.user.created_at,
            is_active: true,
            kyc_status: response.user.kyc_status,
            kyc_level: response.user.kyc_level,
            two_factor_enabled: true,
            email_verified: true,
            language: response.user.language,
            country: response.user.country,
            organization_name: response.user.organization_name,
            organization_type: response.user.organization_type,
          });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
            pending2FAEmail: null,
          });

          toast.success('Giriş başarılı!');
        } catch (error: any) {
          logger.error('2FA login failed', error);
          set({ isLoading: false });

          const errorMessage = error.message || 'İki faktörlü doğrulama başarısız!';
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
        } catch (error: any) {
          logger.error('Logout error', error);
        } finally {
          // Clear Sentry user context
          clearSentryUser();

          get().clearStore();
          localStorage.clear();
          sessionStorage.clear();
          set({ isLoading: false });
          toast.success('Çıkış yapıldı');
        }
      },

      clearStore: () => {
        set({
          user: null,
          requires2FA: false,
          pending2FAEmail: null,
          isAuthenticated: false,
          isLoading: false,
          _hasHydrated: false
        });
      },

      register: async (email: string, password: string, name: string, role: string = 'user') => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            // Create user record in public.users table
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: email,
                  name: name,
                  role: role,
                  is_active: true,
                  email_verified: true,
                  kyc_status: 'pending',
                  kyc_level: 'level_1',
                  verification_level: 'basic'
                }
              ]);

            if (insertError) {
              logger.error('Failed to create user profile', insertError);
              // Don't throw - auth user is created, profile can be created later
            }

            toast.success('Kayıt başarılı! Hesabınıza giriş yapabilirsiniz.');
          }
        } catch (error: any) {
          logger.error('Registration failed', error);
          toast.error(error.message || 'Kayıt başarısız!');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        try {
          const updateData: any = {};

          if (userData.name !== undefined) updateData.name = userData.name;
          if (userData.phone !== undefined) updateData.phone = userData.phone;
          if (userData.country !== undefined) updateData.country = userData.country;
          if (userData.language !== undefined) updateData.language = userData.language;
          if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
          if (userData.walletAddress !== undefined) updateData.wallet_address = userData.walletAddress;
          if (userData.organizationName !== undefined) updateData.organization_name = userData.organizationName;
          if (userData.organizationType !== undefined) updateData.organization_type = userData.organizationType;
          if (userData.specializations !== undefined) updateData.specializations = userData.specializations;
          if (userData.certifications !== undefined) updateData.certifications = userData.certifications;

          const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id);

          if (error) throw error;

          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser, isLoading: false });
          toast.success('Profil güncellendi');
        } catch (error: any) {
          logger.error('Profile update failed', error);
          toast.error('Profil güncellenemedi');
          set({ isLoading: false });
          throw error;
        }
      },

      setLanguage: (language: 'tr' | 'en' | 'de' | 'fr') => {
        set({ language });
        const { user } = get();
        if (user) {
          get().updateProfile({ language });
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });

          if (error) throw error;

          const { user } = get();
          if (user) {
            set({ user: { ...user, emailVerified: true }, isLoading: false });
            toast.success('Email doğrulandı');
          }
        } catch (error: any) {
          logger.error('Email verification failed', error);
          toast.error('Email doğrulanamadı');
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          });

          if (error) throw error;

          toast.success('Şifre sıfırlama linki email adresinize gönderildi');
          set({ isLoading: false });
        } catch (error: any) {
          logger.error('Password reset failed', error);
          toast.error('Şifre sıfırlama başarısız');
          set({ isLoading: false });
          throw error;
        }
      },

      updatePassword: async (password: string) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.updateUser({ password });

          if (error) throw error;

          toast.success('Şifre güncellendi');
          set({ isLoading: false });
        } catch (error: any) {
          logger.error('Password update failed', error);
          toast.error('Şifre güncellenemedi');
          set({ isLoading: false });
          throw error;
        }
      },

      enable2FA: async (): Promise<string> => {
        throw new Error('2FA not implemented yet. Please contact support for assistance.');
      },

      verify2FA: async (code: string) => {
        throw new Error('2FA not implemented yet. Please contact support for assistance.');
      },

      disable2FA: async (code: string) => {
        throw new Error('2FA not implemented yet. Please contact support for assistance.');
      }
    }),
    {
      name: 'auth-storage',
      version: 1,
      partialize: (state) => ({
        language: state.language
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      }
    }
  )
);

supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();

  if (event === 'SIGNED_IN' && session?.user) {
    store.fetchUserProfile(session.user.id).catch(err => {
      logger.error('Failed to fetch user profile on sign in', err);
    });
  } else if (event === 'SIGNED_OUT') {
    store.clearStore();
  }
});
