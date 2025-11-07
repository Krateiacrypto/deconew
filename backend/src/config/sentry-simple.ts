/**
 * Sentry Configuration for Backend (Simplified for v8)
 * Production-ready error tracking and performance monitoring
 */

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { Application, Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const RELEASE = process.env.APP_VERSION || 'dev';

/**
 * Initialize Sentry for Node.js/Express backend
 */
export function initSentry(app: Application) {
  // Only initialize if DSN is provided
  if (!SENTRY_DSN) {
    logger.warn('Sentry DSN not provided. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: RELEASE,

    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.2 : 1.0,

    // Profiling
    profilesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    integrations: [nodeProfilingIntegration()],

    // Error filtering
    beforeSend(event) {
      // Filter out expected network errors
      const errorMessage = event.exception?.values?.[0]?.value?.toLowerCase() || '';
      if (
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('etimedout')
      ) {
        return null;
      }
      return event;
    },

    debug: ENVIRONMENT === 'development',
  });

  logger.info('✓ Sentry initialized for backend', { environment: ENVIRONMENT });
}

/**
 * Simple error handler middleware
 */
export function sentryErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    // Capture error in Sentry
    Sentry.captureException(err);

    // Pass to next error handler
    next(err);
  };
}

/**
 * Set user context
 */
export function setSentryUser(userId: string | number, email?: string, role?: string) {
  Sentry.setUser({
    id: String(userId),
    email,
    role,
  });
}

/**
 * Clear user context
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Capture exception manually
 */
export function captureSentryException(error: Error, context?: Record<string, any>) {
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

// Export Sentry for direct usage
export { Sentry };
