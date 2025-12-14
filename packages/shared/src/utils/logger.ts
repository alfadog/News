export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

export class StructuredLogger {
  constructor(private scope: string) {}

  log(entry: LogEntry) {
    const payload = {
      scope: this.scope,
      level: entry.level,
      message: entry.message,
      context: entry.context ?? {},
      timestamp: entry.timestamp ?? new Date().toISOString()
    };
    // eslint-disable-next-line no-console
    console[entry.level === 'debug' ? 'log' : entry.level](JSON.stringify(payload));
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'debug', message, context });
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'info', message, context });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'warn', message, context });
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'error', message, context });
  }
}

export const createLogger = (scope: string) => new StructuredLogger(scope);
