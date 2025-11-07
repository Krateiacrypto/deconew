/**
 * Authentication API Client
 * Handles login, register, and token management
 */

import { apiClient } from '../apiClient';
import { logger } from '../../utils/logger';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginWith2FARequest {
  email: string;
  password: string;
  token: string;
  isBackupCode?: boolean;
}

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  role_id?: number;
  kyc_level: string;
  kyc_status: string;
  organization_name?: string;
  organization_type?: string;
  country?: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserResponse;
  tokens: AuthTokenResponse;
  requires2FA?: boolean; // If true, client must call verify-2fa
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_name?: string;
  organization_type?: 'individual' | 'company' | 'ngo' | 'financial_institution';
  phone?: string;
  country?: string;
  language?: 'tr' | 'en' | 'de' | 'fr';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    status: string;
  };
  registration_id: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  tokens: AuthTokenResponse;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Login with email and password
   * If 2FA is enabled, returns requires2FA: true
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      logger.info('Attempting login', { email: data.email });
      const response = await apiClient.post<LoginResponse>('/auth/login', data);

      // If 2FA required, don't save tokens yet
      if (response.requires2FA) {
        logger.info('2FA verification required', { email: data.email });
        return response;
      }

      // Save tokens to localStorage
      localStorage.setItem('access_token', response.tokens.access_token);
      localStorage.setItem('refresh_token', response.tokens.refresh_token);

      logger.info('Login successful', {
        email: data.email,
        userId: response.user.id,
      });

      return response;
    } catch (error) {
      logger.error('Login failed', { email: data.email, error });
      throw error;
    }
  },

  /**
   * Complete login with 2FA verification
   */
  async loginWith2FA(data: LoginWith2FARequest): Promise<LoginResponse> {
    try {
      logger.info('Attempting login with 2FA', { email: data.email });
      const response = await apiClient.post<LoginResponse>(
        '/auth/login/verify-2fa',
        data
      );

      // Save tokens after successful 2FA verification
      localStorage.setItem('access_token', response.tokens.access_token);
      localStorage.setItem('refresh_token', response.tokens.refresh_token);

      logger.info('Login with 2FA successful', {
        email: data.email,
        userId: response.user.id,
      });

      return response;
    } catch (error) {
      logger.error('Login with 2FA failed', { email: data.email, error });
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      logger.info('Attempting registration', { email: data.email });
      const response = await apiClient.post<RegisterResponse>(
        '/auth/register',
        data
      );
      logger.info('Registration successful', { email: data.email });
      return response;
    } catch (error) {
      logger.error('Registration failed', { email: data.email, error });
      throw error;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(
    refresh_token: string
  ): Promise<RefreshTokenResponse> {
    try {
      logger.info('Refreshing access token');
      const response = await apiClient.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        { refresh_token }
      );

      // Update tokens in localStorage
      localStorage.setItem('access_token', response.tokens.access_token);
      localStorage.setItem('refresh_token', response.tokens.refresh_token);

      logger.info('Token refresh successful');
      return response;
    } catch (error) {
      logger.error('Token refresh failed', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      logger.info('Logging out');
      // Call backend logout endpoint (if needed for token blacklist)
      await apiClient.post('/auth/logout', undefined, true);

      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed', error);
      // Clear tokens anyway
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<UserResponse> {
    try {
      logger.info('Fetching current user');
      const response = await apiClient.get<{ success: boolean; user: UserResponse }>(
        '/auth/me',
        true
      );
      logger.info('Current user fetched', { userId: response.user.id });
      return response.user;
    } catch (error) {
      logger.error('Failed to fetch current user', error);
      throw error;
    }
  },
};

export default authApi;
