import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const logLevel = process.env.LOG_LEVEL || 'debug';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      return stack ? `${logMessage}\n${stack}` : logMessage;
    })
  ),
  defaultMeta: { service: 'decarbonize-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          const logMessage = `[${timestamp}] [${level}] ${message}`;
          return stack ? `${logMessage}\n${stack}` : logMessage;
        })
      )
    }),

    // File transports
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Ensure logs directory exists
import { mkdir } from 'fs/promises';
mkdir('logs', { recursive: true }).catch(() => {
  // Directory might already exist
});

export { logger };
export default logger;
