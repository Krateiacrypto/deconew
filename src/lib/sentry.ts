/**
 * Sentry Configuration for Frontend
 * Production-ready error tracking, performance monitoring, and session replay
 */

import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || import.meta.env.MODE || 'development';
const RELEASE = import.meta.env.VITE_APP_VERSION || 'dev';

/**
 * Initialize Sentry for React application
 * Only initializes in production or when DSN is explicitly provided
 */
export function initSentry() {
  // Only initialize if DSN is provided
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,

    // Performance Monitoring
    integrations: [
      // React Router instrumentation
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),

      // Session Replay - captures user interactions
      new Sentry.Replay({
        maskAllText: true, // Mask all text for privacy
        blockAllMedia: true, // Block images/videos
        maskAllInputs: true, // Mask form inputs
      }),

      // Breadcrumbs for better context
      new Sentry.Breadcrumbs({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],

    // Performance Monitoring - Sample rate
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

    // Session Replay - Sample rate
    replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.1 : 0, // 10% in prod, disabled in dev
    replaysOnErrorSampleRate: 1.0, // 100% on errors

    // Error filtering - ignore common non-critical errors
    beforeSend(event, hint) {
      // Filter out non-critical errors
      const error = hint.originalException;

      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();

        // Ignore network errors that are expected
        if (
          message.includes('network error') ||
          message.includes('failed to fetch') ||
          message.includes('load failed')
        ) {
          return null;
        }

        // Ignore ResizeObserver errors (browser quirk)
        if (message.includes('resizeobserver')) {
          return null;
        }
      }

      return event;
    },

    // Add release info
    beforeBreadcrumb(breadcrumb) {
      // Filter out sensitive data from breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.message) {
        // Don't log passwords, tokens, etc.
        if (
          breadcrumb.message.toLowerCase().includes('password') ||
          breadcrumb.message.toLowerCase().includes('token')
        ) {
          return null;
        }
      }

      return breadcrumb;
    },

    // Debug mode
    debug: ENVIRONMENT === 'development',

    // Attach stack traces
    attachStacktrace: true,

    // Max breadcrumbs to keep
    maxBreadcrumbs: 50,

    // Normalize URLs for better grouping
    normalizeDepth: 10,
  });

  console.log(`✓ Sentry initialized (${ENVIRONMENT})`);
}

/**
 * Set user context for Sentry
 * Call this after user login
 */
export function setSentryUser(user: {
  id: string | number;
  email?: string;
  username?: string;
  role?: string;
}) {
  Sentry.setUser({
    id: String(user.id),
    email: user.email,
    username: user.username || user.email,
    role: user.role,
  });
}

/**
 * Clear user context
 * Call this after user logout
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Set custom context for debugging
 */
export function setSentryContext(key: string, data: Record<string, any>) {
  Sentry.setContext(key, data);
}

/**
 * Add breadcrumb manually
 */
export function addSentryBreadcrumb(
  message: string,
  category: string = 'custom',
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Capture exception manually
 */
export function captureSentryException(
  error: Error,
  context?: Record<string, any>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture message manually
 */
export function captureSentryMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Start a transaction for performance monitoring
 */
export function startSentryTransaction(
  name: string,
  op: string = 'custom'
) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Start a span within a transaction
 */
export function startSentrySpan(
  transaction: Sentry.Transaction,
  description: string,
  op: string = 'custom'
) {
  return transaction.startChild({
    op,
    description,
  });
}

// Export Sentry for ErrorBoundary
export { Sentry };
