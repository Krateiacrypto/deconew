/**
 * Custom API Error Class
 * Standardizes error handling across the application
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'CONFLICT_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'BLOCKCHAIN_ERROR'
  | 'SUPABASE_ERROR';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ApiErrorOptions {
  code: ErrorCode;
  message: string;
  userMessage?: string;
  severity?: ErrorSeverity;
  statusCode?: number;
  originalError?: Error;
  context?: Record<string, any>;
  retryable?: boolean;
}

/**
 * Custom error class for API operations
 */
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage: string;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly originalError?: Error;
  public readonly context: Record<string, any>;
  public readonly retryable: boolean;
  public readonly timestamp: Date;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    Object.setPrototypeOf(this, ApiError.prototype);

    this.name = 'ApiError';
    this.code = options.code;
    this.userMessage = options.userMessage || this.getDefaultUserMessage(options.code);
    this.severity = options.severity || this.getDefaultSeverity(options.code);
    this.statusCode = options.statusCode || this.getDefaultStatusCode(options.code);
    this.originalError = options.originalError;
    this.context = options.context || {};
    this.retryable = options.retryable !== undefined ? options.retryable : this.isDefaultRetryable(options.code);
    this.timestamp = new Date();

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get default user-friendly message for error code
   */
  private getDefaultUserMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
      VALIDATION_ERROR: 'Please check your input and try again.',
      AUTHENTICATION_ERROR: 'Please sign in to continue.',
      AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
      NOT_FOUND_ERROR: 'The requested resource was not found.',
      CONFLICT_ERROR: 'This resource already exists.',
      RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
      SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
      NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
      UNKNOWN_ERROR: 'An unexpected error occurred.',
      BLOCKCHAIN_ERROR: 'Blockchain operation failed. Please try again.',
      SUPABASE_ERROR: 'Database operation failed. Please try again.',
    };

    return messages[code];
  }

  /**
   * Get default HTTP status code for error code
   */
  private getDefaultStatusCode(code: ErrorCode): number {
    const statusCodes: Record<ErrorCode, number> = {
      VALIDATION_ERROR: 400,
      AUTHENTICATION_ERROR: 401,
      AUTHORIZATION_ERROR: 403,
      NOT_FOUND_ERROR: 404,
      CONFLICT_ERROR: 409,
      RATE_LIMIT_ERROR: 429,
      SERVER_ERROR: 500,
      NETWORK_ERROR: 0,
      UNKNOWN_ERROR: 500,
      BLOCKCHAIN_ERROR: 500,
      SUPABASE_ERROR: 500,
    };

    return statusCodes[code];
  }

  /**
   * Get default severity for error code
   */
  private getDefaultSeverity(code: ErrorCode): ErrorSeverity {
    const severities: Record<ErrorCode, ErrorSeverity> = {
      VALIDATION_ERROR: 'low',
      AUTHENTICATION_ERROR: 'medium',
      AUTHORIZATION_ERROR: 'medium',
      NOT_FOUND_ERROR: 'low',
      CONFLICT_ERROR: 'medium',
      RATE_LIMIT_ERROR: 'medium',
      SERVER_ERROR: 'high',
      NETWORK_ERROR: 'high',
      UNKNOWN_ERROR: 'high',
      BLOCKCHAIN_ERROR: 'critical',
      SUPABASE_ERROR: 'high',
    };

    return severities[code];
  }

  /**
   * Check if error is retryable by default
   */
  private isDefaultRetryable(code: ErrorCode): boolean {
    const retryableCodes: ErrorCode[] = [
      'RATE_LIMIT_ERROR',
      'NETWORK_ERROR',
      'SERVER_ERROR',
      'BLOCKCHAIN_ERROR',
      'SUPABASE_ERROR',
    ];

    return retryableCodes.includes(code);
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      statusCode: this.statusCode,
      retryable: this.retryable,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Convert error to string
   */
  toString(): string {
    return `[${this.code}] ${this.message}`;
  }
}

/**
 * Factory functions for creating common errors
 */
export const createError = {
  /**
   * Validation error
   */
  validation: (message: string, context?: Record<string, any>): ApiError => {
    return new ApiError({
      code: 'VALIDATION_ERROR',
      message,
      context,
    });
  },

  /**
   * Authentication error
   */
  authentication: (message: string = 'Authentication failed'): ApiError => {
    return new ApiError({
      code: 'AUTHENTICATION_ERROR',
      message,
      userMessage: 'Please sign in to continue.',
    });
  },

  /**
   * Authorization error
   */
  authorization: (message: string = 'Access denied'): ApiError => {
    return new ApiError({
      code: 'AUTHORIZATION_ERROR',
      message,
      userMessage: 'You do not have permission to perform this action.',
    });
  },

  /**
   * Not found error
   */
  notFound: (resource: string): ApiError => {
    return new ApiError({
      code: 'NOT_FOUND_ERROR',
      message: `${resource} not found`,
      userMessage: `The ${resource} you're looking for doesn't exist.`,
    });
  },

  /**
   * Conflict error (duplicate resource)
   */
  conflict: (message: string): ApiError => {
    return new ApiError({
      code: 'CONFLICT_ERROR',
      message,
    });
  },

  /**
   * Rate limit error
   */
  rateLimit: (retryAfter?: number): ApiError => {
    const error = new ApiError({
      code: 'RATE_LIMIT_ERROR',
      message: 'Rate limit exceeded',
      userMessage: retryAfter
        ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
        : 'Too many requests. Please try again later.',
      retryable: true,
    });

    if (retryAfter) {
      error.context.retryAfter = retryAfter;
    }

    return error;
  },

  /**
   * Server error
   */
  server: (message: string = 'Internal server error', originalError?: Error): ApiError => {
    return new ApiError({
      code: 'SERVER_ERROR',
      message,
      severity: 'high',
      originalError,
      retryable: true,
    });
  },

  /**
   * Network error
   */
  network: (message: string = 'Network error'): ApiError => {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message,
      userMessage: 'Network connection error. Please check your internet connection.',
      retryable: true,
    });
  },

  /**
   * Blockchain error
   */
  blockchain: (message: string, originalError?: Error): ApiError => {
    return new ApiError({
      code: 'BLOCKCHAIN_ERROR',
      message,
      userMessage: 'Blockchain operation failed. Please try again.',
      severity: 'critical',
      originalError,
      retryable: true,
    });
  },

  /**
   * Supabase error
   */
  supabase: (message: string, originalError?: Error): ApiError => {
    return new ApiError({
      code: 'SUPABASE_ERROR',
      message,
      userMessage: 'Database operation failed. Please try again.',
      severity: 'high',
      originalError,
      retryable: true,
    });
  },

  /**
   * Unknown error
   */
  unknown: (originalError: Error): ApiError => {
    return new ApiError({
      code: 'UNKNOWN_ERROR',
      message: originalError.message,
      originalError,
      severity: 'high',
      retryable: false,
    });
  },
};

/**
 * Check if an error is an ApiError
 */
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Convert various error types to ApiError
 */
export const toApiError = (error: any): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return createError.unknown(error);
  }

  if (typeof error === 'string') {
    return createError.unknown(new Error(error));
  }

  return createError.unknown(new Error('Unknown error'));
};

/**
 * Handle Supabase errors and convert to ApiError
 */
export const handleSupabaseError = (error: any): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  const message = error?.message || 'Database operation failed';
  const status = error?.status;

  switch (status) {
    case 400:
      return createError.validation(message);
    case 401:
      return createError.authentication(message);
    case 403:
      return createError.authorization(message);
    case 404:
      return createError.notFound('Resource');
    case 409:
      return createError.conflict(message);
    case 429:
      return createError.rateLimit();
    default:
      return createError.supabase(message, error instanceof Error ? error : undefined);
  }
};

/**
 * Handle blockchain errors and convert to ApiError
 */
export const handleBlockchainError = (error: any): ApiError => {
  if (isApiError(error)) {
    return error;
  }

  const message = error?.message || 'Blockchain operation failed';

  if (message.includes('insufficient') || message.includes('balance')) {
    return new ApiError({
      code: 'BLOCKCHAIN_ERROR',
      message: 'Insufficient balance for this transaction',
      userMessage: 'You do not have enough balance to complete this transaction.',
      originalError: error instanceof Error ? error : undefined,
    });
  }

  if (message.includes('user denied') || message.includes('rejected')) {
    return new ApiError({
      code: 'BLOCKCHAIN_ERROR',
      message: 'Transaction was rejected',
      userMessage: 'You rejected the transaction. Please try again.',
      originalError: error instanceof Error ? error : undefined,
    });
  }

  return createError.blockchain(message, error instanceof Error ? error : undefined);
};
