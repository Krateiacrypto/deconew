/**
 * API Client for Backend Integration
 * Centralized HTTP client for backend API calls
 */

import { logger } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * API Client class for backend communication
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authorization header from localStorage
   */
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(requiresAuth ? this.getAuthHeader() : {}),
      },
    };

    try {
      const url = `${this.baseUrl}${endpoint}`;
      logger.debug('API Request', { method: config.method, url });

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Request failed';
        logger.error('API Error', {
          status: response.status,
          message: errorMessage,
          code: data.code,
        });
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      logger.error('API Request Failed', { endpoint, error });
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      requiresAuth,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
