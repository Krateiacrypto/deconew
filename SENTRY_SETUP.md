# 🔍 Sentry Monitoring Setup Guide

**Production-Ready Error Tracking & Performance Monitoring**

Last Updated: 30 Ekim 2025
Status: ✅ Fully Integrated

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features Implemented](#features-implemented)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Alert Rules & Integration](#alert-rules--integration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Sentry monitoring is fully integrated into both frontend (React) and backend (Node.js/Express) with:

- ✅ **Error Tracking** - Automatic exception capture
- ✅ **Performance Monitoring** - Request/response time tracking
- ✅ **Distributed Tracing** - Full request lifecycle visibility
- ✅ **Session Replay** - User interaction recordings
- ✅ **Custom Context** - User data, business logic tagging
- ✅ **Slow Query Detection** - Database performance alerts
- ✅ **Source Maps** - Production error line numbers
- ✅ **Breadcrumbs** - User action trails

---

## ✨ Features Implemented

### Frontend (React)
```
src/lib/sentry.ts
├── Error boundary integration
├── React Router instrumentation
├── Session Replay (10% sample rate)
├── Performance monitoring
├── User context tracking
├── Custom breadcrumbs
└── Privacy-first (masks all text/inputs)
```

### Backend (Node.js/Express)
```
backend/src/config/sentry.ts
├── Express middleware integration
├── MySQL query instrumentation
├── Distributed tracing (OpenTelemetry)
├── Profiling (10% sample rate in prod)
├── Slow query detection (>1000ms)
├── Performance per endpoint
└── User context from JWT
```

---

## 🚀 Setup Instructions

### Step 1: Create Sentry Account

1. Go to [sentry.io](https://sentry.io) and sign up
2. Create a new organization
3. Create two projects:
   - **Frontend Project** (React)
   - **Backend Project** (Node.js)

### Step 2: Get DSN Keys

**Frontend DSN:**
- Navigate to: `Settings` → `Projects` → `[Your Frontend Project]` → `Client Keys (DSN)`
- Copy the DSN URL (format: `https://xxx@oyyy.ingest.sentry.io/zzz`)

**Backend DSN:**
- Navigate to: `Settings` → `Projects` → `[Your Backend Project]` → `Client Keys (DSN)`
- Copy the DSN URL

### Step 3: Configure Environment Variables

#### Frontend (`.env`)
```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-frontend-key@o123456.ingest.sentry.io/123456
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
```

#### Backend (`backend/.env.local`)
```bash
# Sentry Configuration
SENTRY_DSN=https://your-backend-key@o123456.ingest.sentry.io/654321
NODE_ENV=production
APP_VERSION=1.0.0
```

### Step 4: Build with Source Maps

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

### Step 5: Deploy & Verify

1. Deploy your application
2. Trigger a test error:
   ```javascript
   // Frontend
   throw new Error('Test Sentry frontend integration');

   // Backend
   app.get('/test-error', () => {
     throw new Error('Test Sentry backend integration');
   });
   ```
3. Check Sentry dashboard for the error

---

## ⚙️ Configuration

### Frontend Configuration

**Location:** `src/lib/sentry.ts`

```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  environment: 'production',
  release: '1.0.0',

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% on errors

  // Privacy Settings
  maskAllText: true,
  blockAllMedia: true,
  maskAllInputs: true,
});
```

### Backend Configuration

**Location:** `backend/src/config/sentry.ts`

```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  environment: 'production',
  release: '1.0.0',

  // Performance Monitoring
  tracesSampleRate: 0.2, // 20% of transactions

  // Profiling
  profilesSampleRate: 0.1, // 10% of traces

  // Integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Sentry.Integrations.Mysql(),
  ],
});
```

---

## 💻 Usage Examples

### Manual Error Capture

```typescript
// Frontend
import { captureSentryException } from './lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  captureSentryException(error, {
    operation: 'payment_processing',
    userId: user.id,
    amount: 1000,
  });
}
```

### Custom Breadcrumbs

```typescript
// Frontend
import { addSentryBreadcrumb } from './lib/sentry';

addSentryBreadcrumb(
  'User clicked checkout button',
  'user-action',
  'info',
  { cart_items: 5, total: 299.99 }
);
```

### Performance Tracking

```typescript
// Frontend
import { startSentryTransaction } from './lib/sentry';

const transaction = startSentryTransaction('checkout_flow', 'http.request');

// ... perform operations ...

transaction.finish();
```

### User Context (Automatic)

```typescript
// Already integrated in authStore
// Automatically sets user context on login
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
  role: user.role,
});
```

### Slow Query Detection (Backend)

```typescript
// Automatically tracks queries > 1000ms
// Configured in backend/src/index.ts
app.use(slowQueryMiddleware(1000)); // 1 second threshold
```

---

## 🔔 Alert Rules & Integration

### Recommended Alert Rules

#### 1. High Error Rate Alert
```
Condition: Error count > 50 in 1 hour
Action: Send to Slack #engineering-alerts
Severity: Critical
```

#### 2. Slow Response Time Alert
```
Condition: P95 response time > 2000ms
Action: Send to PagerDuty
Severity: Warning
```

#### 3. New Error Type Alert
```
Condition: First seen error
Action: Send to Slack #new-errors
Severity: Info
```

#### 4. Database Query Performance
```
Condition: Query duration > 5000ms
Action: Send to #database-team
Severity: Warning
```

### Slack Integration

1. Go to Sentry: `Settings` → `Integrations` → `Slack`
2. Click "Add Workspace"
3. Authorize Sentry to access Slack
4. Configure channels:
   - `#engineering-alerts` - Critical errors
   - `#new-errors` - New error types
   - `#performance` - Slow queries/requests

### PagerDuty Integration

1. Go to Sentry: `Settings` → `Integrations` → `PagerDuty`
2. Enter your PagerDuty API key
3. Map services:
   - Frontend errors → Web Team
   - Backend errors → API Team
   - Database issues → Infrastructure Team

### Email Alerts

1. Go to `Settings` → `Projects` → `[Your Project]` → `Alerts`
2. Create alert rule
3. Add email recipients
4. Set conditions (error count, frequency, etc.)

---

## 🎯 Best Practices

### 1. Tag Errors Appropriately

```typescript
// Good - provides context
Sentry.withScope((scope) => {
  scope.setTag('payment_provider', 'stripe');
  scope.setTag('user_tier', 'premium');
  scope.setContext('order', {
    id: order.id,
    total: order.total,
    items: order.items.length,
  });
  Sentry.captureException(error);
});

// Bad - no context
Sentry.captureException(error);
```

### 2. Filter Sensitive Data

```typescript
// Already implemented in sentry.ts
beforeSend(event, hint) {
  // Remove sensitive data from breadcrumbs
  if (breadcrumb.message?.includes('password')) {
    return null;
  }
  return event;
}
```

### 3. Set User Context on Login

```typescript
// Already integrated in authStore
// Happens automatically on successful login
```

### 4. Use Environment Tags

```typescript
// Automatically set based on NODE_ENV
environment: 'production' | 'staging' | 'development'
```

### 5. Monitor Performance Trends

- Weekly review of P95 response times
- Monitor slow query count trends
- Track error rate by endpoint
- Review session replay for UX issues

---

## 📊 Monitoring Checklist

### Daily
- [ ] Check for new error types
- [ ] Review critical alerts
- [ ] Verify no ongoing incidents

### Weekly
- [ ] Review error trends
- [ ] Check performance metrics
- [ ] Update alert thresholds if needed
- [ ] Review session replays for UX insights

### Monthly
- [ ] Audit alert rules
- [ ] Review integration health
- [ ] Check source map uploads
- [ ] Optimize sample rates based on volume

---

## 🔧 Troubleshooting

### Errors Not Appearing in Sentry

**Check:**
1. DSN configured correctly in `.env`
2. Sentry initialized before app starts
3. Network access to `sentry.io` (firewall/proxy)
4. Sample rate not too low

**Test:**
```typescript
// Force an error
throw new Error('Sentry test error');
```

### Source Maps Not Working

**Frontend:**
```bash
# Ensure build includes source maps
npm run build

# Check dist/ folder for .map files
ls -la dist/assets/*.map
```

**Backend:**
```bash
# TypeScript compiler generates source maps
cd backend
npm run build

# Check dist/ folder
ls -la dist/**/*.map
```

### Performance Data Missing

**Check:**
```typescript
// Ensure tracing is enabled
tracesSampleRate: 0.1  // Should be > 0
```

### Slow Query Detection Not Working

**Backend Check:**
```typescript
// Ensure middleware is registered
app.use(slowQueryMiddleware(1000));

// Check logs for slow query warnings
grep "Slow database query" logs/*.log
```

---

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [React Integration Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Node.js Integration Guide](https://docs.sentry.io/platforms/node/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

---

## 🎉 Summary

**Sentry is fully integrated and production-ready!**

✅ Automatic error capture
✅ Performance monitoring
✅ User tracking
✅ Session replay
✅ Slow query detection
✅ Distributed tracing
✅ Privacy-first configuration

**Next Steps:**
1. Add DSN to `.env` files
2. Deploy to production
3. Configure alert rules
4. Setup Slack/PagerDuty integration
5. Monitor daily for trends

---

**Questions?** Check troubleshooting section or Sentry docs.
