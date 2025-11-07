/**
 * useAsyncOperation Hook
 * Standardized hook for handling async operations with loading, data, and error states
 * Automatically handles error logging and user notifications
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError, isApiError, toApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';

export interface UseAsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseAsyncOperationOptions {
  /**
   * Show error toast notification to user
   */
  showErrorToast?: boolean;

  /**
   * Show success toast notification to user
   */
  showSuccessToast?: boolean;

  /**
   * Error message to display (overrides default)
   */
  errorMessage?: string;

  /**
   * Success message to display
   */
  successMessage?: string;

  /**
   * Auto-log errors
   */
  autoLog?: boolean;

  /**
   * Callback when operation succeeds
   */
  onSuccess?: (data: any) => void;

  /**
   * Callback when operation fails
   */
  onError?: (error: ApiError) => void;

  /**
   * Callback when operation completes (success or error)
   */
  onFinally?: () => void;
}

const defaultOptions: UseAsyncOperationOptions = {
  showErrorToast: true,
  showSuccessToast: false,
  autoLog: true,
  onSuccess: undefined,
  onError: undefined,
  onFinally: undefined,
};

/**
 * Hook for handling async operations with standardized error handling
 *
 * @example
 * const { data, loading, error, execute } = useAsyncOperation<User>({
 *   showErrorToast: true,
 * });
 *
 * const handleFetch = () => {
 *   execute(async () => {
 *     const response = await fetch('/api/user');
 *     return response.json();
 *   });
 * };
 */
export const useAsyncOperation = <T = any>(options: UseAsyncOperationOptions = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };

  const [state, setState] = useState<UseAsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Execute async operation
   */
  const execute = useCallback(
    async (
      operation: (signal?: AbortSignal) => Promise<T>,
      operationOptions?: Omit<UseAsyncOperationOptions, 'onSuccess' | 'onError' | 'onFinally'>
    ): Promise<T | null> => {
      const finalOptions = { ...mergedOptions, ...operationOptions };

      // Cancel previous operation if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Update loading state
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));
      }

      try {
        const result = await operation(abortControllerRef.current.signal);

        // Only update state if component is still mounted and operation wasn't cancelled
        if (isMountedRef.current && !abortControllerRef.current.signal.aborted) {
          setState({
            data: result,
            loading: false,
            error: null,
          });

          // Call success callback
          if (finalOptions.onSuccess) {
            finalOptions.onSuccess(result);
          }

          // Show success toast if enabled
          if (finalOptions.showSuccessToast && finalOptions.successMessage) {
            toast.success(finalOptions.successMessage);
          }
        }

        return result;
      } catch (err: any) {
        // Ignore abort errors
        if (err?.name === 'AbortError') {
          if (finalOptions.autoLog) {
            logger.debug('Async operation was cancelled');
          }
          return null;
        }

        const apiError = toApiError(err);

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setState({
            data: null,
            loading: false,
            error: apiError,
          });
        }

        // Log error if enabled
        if (finalOptions.autoLog) {
          logger.error('Async operation failed', {
            error: apiError.toJSON(),
          });
        }

        // Call error callback
        if (finalOptions.onError) {
          finalOptions.onError(apiError);
        }

        // Show error toast if enabled
        if (finalOptions.showErrorToast) {
          const message = finalOptions.errorMessage || apiError.userMessage;
          toast.error(message);
        }

        return null;
      } finally {
        // Call finally callback
        if (finalOptions.onFinally && isMountedRef.current) {
          finalOptions.onFinally();
        }
      }
    },
    [mergedOptions]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Set data manually
   */
  const setData = useCallback((data: T | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({
        ...prev,
        data,
      }));
    }
  }, []);

  /**
   * Set error manually
   */
  const setError = useCallback((error: ApiError | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({
        ...prev,
        error,
      }));
    }
  }, []);

  /**
   * Retry last operation
   * Note: This requires the operation function to be stable
   */
  const retry = useCallback(
    async (operation: () => Promise<T>) => {
      return execute(operation);
    },
    [execute]
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // Cancel any pending operations
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    retry,
    isLoading: state.loading,
    isError: state.error !== null,
    isSuccess: state.data !== null && state.error === null,
  };
};

/**
 * Hook for fetching data on mount or when dependencies change
 */
export const useAsyncData = <T = any>(
  asyncFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options?: UseAsyncOperationOptions
) => {
  const { execute, ...state } = useAsyncOperation<T>(options);

  useEffect(() => {
    execute(async () => asyncFn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ...state, refetch: () => execute(async () => asyncFn()) };
};

/**
 * Hook for handling async mutations (POST, PUT, DELETE, etc.)
 */
export const useAsyncMutation = <T = any, P = void>(
  asyncFn: (payload: P) => Promise<T>,
  options?: UseAsyncOperationOptions
) => {
  const { execute, ...state } = useAsyncOperation<T>(options);

  const mutate = useCallback(
    async (payload: P) => {
      return execute(async () => asyncFn(payload));
    },
    [execute, asyncFn]
  );

  return { mutate, ...state };
};

export default useAsyncOperation;
