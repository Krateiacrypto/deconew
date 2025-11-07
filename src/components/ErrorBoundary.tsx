/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 * Prevents the entire application from crashing
 */

import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '../utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

/**
 * Error Boundary Component
 * Wraps child components to catch and handle errors gracefully
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log the error details for debugging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to error tracking service
    logger.error('React Error Boundary caught an error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorCount: this.state.errorCount + 1,
      timestamp: new Date().toISOString(),
    });

    // Send to Sentry if available
    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  /**
   * Reset error state to allow retry
   */
  handleRetry = () => {
    // Clear any pending timeout
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Reset state after a short delay to allow re-render
    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }, 100);
  };

  /**
   * Clean up timeout on unmount
   */
  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error || new Error('Unknown error'), this.handleRetry);
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
interface DefaultErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Oops! Something went wrong</h1>

        {/* Error Description */}
        <p className="text-gray-600 text-center mb-6">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 max-h-40 overflow-auto">
            <p className="text-xs font-mono text-gray-700 break-words">
              <strong>Error:</strong> {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Go to Home
          </button>
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="/support" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Hook to manually trigger error in Error Boundary
 * Useful for error testing or conditional error handling
 */
export const useErrorHandler = () => {
  const [, setError] = React.useState();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};

export default ErrorBoundary;

// Extend window object to include Sentry
declare global {
  interface Window {
    __SENTRY__?: any;
  }
}
