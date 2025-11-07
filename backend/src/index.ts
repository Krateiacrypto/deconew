import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { pool, testConnection } from './config/database.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import twoFactorRoutes from './routes/twoFactor.js';
import workflowRoutes from './routes/workflowRoutes.js';
import carbonRoutes from './routes/carbonRoutes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import { initSentry, sentryErrorHandler } from './config/sentry-simple.js';

dotenv.config({ path: '.env.local' });

const app: Application = express();

// ============================================
// SENTRY INITIALIZATION
// ============================================

// Initialize Sentry (must be first)
initSentry(app);

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(
  morgan(':method :url :status :response-time ms', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
);

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Database health check
app.get('/api/health/db', async (_req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    res.json({
      status: 'ok',
      message: 'Database connection successful',
      database: process.env.DB_NAME,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// API ROUTES
// ============================================

// Authentication routes
app.use('/api/auth', authRoutes);

// Two-Factor Authentication routes
app.use('/api/auth/2fa', twoFactorRoutes);

// Workflow routes (7-stage project workflow)
app.use('/api', workflowRoutes);

// Carbon calculation routes
app.use('/api', carbonRoutes);

// NGO routes
app.use('/api', ngoRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route not found`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Global error handler
app.use(
  (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    logger.error('Unhandled error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      success: false,
      error: message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    const PORT = process.env.SERVER_PORT || 3001;
    const HOST = process.env.SERVER_HOST || 'localhost';

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server started`);
      logger.info(`📍 Listening on http://${HOST}:${PORT}`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
      logger.info(`✅ Ready to accept requests`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        // Close database connections
        await pool.end();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        // Close database connections
        await pool.end();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server
startServer();

export default app;
