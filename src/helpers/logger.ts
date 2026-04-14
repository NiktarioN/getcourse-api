import type { Logger } from '../types/common.ts';

type LogLevel = 'silent' | 'error' | 'debug';

/**
 * Дефолтный логгер — пишет в console с префиксом [ GETCOURSE API ].
 * silent (по умолчанию) — ничего не выводится.
 * error — только ошибки.
 * debug — все уровни логов.
 */
export default class ConsoleLogger implements Logger {
  private readonly prefix = '[ GETCOURSE API ]';

  private readonly logLevel: LogLevel;

  constructor(logLevel: LogLevel = 'silent') {
    this.logLevel = logLevel;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.logLevel !== 'debug') {
      return;
    }

    if (context === undefined) {
      globalThis.console.debug(this.prefix, message);

      return;
    }

    globalThis.console.debug(this.prefix, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.logLevel !== 'debug') {
      return;
    }

    if (context === undefined) {
      globalThis.console.info(this.prefix, message);

      return;
    }

    globalThis.console.info(this.prefix, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.logLevel !== 'debug') {
      return;
    }

    if (context === undefined) {
      globalThis.console.warn(this.prefix, message);

      return;
    }

    globalThis.console.warn(this.prefix, message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    if (this.logLevel === 'silent') {
      return;
    }

    if (context === undefined) {
      globalThis.console.error(this.prefix, message);

      return;
    }

    globalThis.console.error(this.prefix, message, context);
  }
}
