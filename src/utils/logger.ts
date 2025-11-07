type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      const style = this.getLogStyle(level);
      console.log(`%c[${level.toUpperCase()}]`, style, message, data || '');
    }

    if (level === 'error' && !this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private getLogStyle(level: LogLevel): string {
    const styles = {
      info: 'color: #3b82f6; font-weight: bold',
      warn: 'color: #f59e0b; font-weight: bold',
      error: 'color: #ef4444; font-weight: bold',
      debug: 'color: #8b5cf6; font-weight: bold',
    };
    return styles[level];
  }

  private sendToMonitoring(entry: LogEntry) {
    // TODO: Integrate with Sentry or other monitoring service
    // For now, just store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(entry);
      if (logs.length > 50) logs.shift();
      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
