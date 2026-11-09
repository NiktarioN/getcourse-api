import { setTimeout as wait } from 'node:timers/promises';

/** Настройки повтора */
interface RetryOptions {
  /** Сколько всего попыток, включая первую */
  attempts: number;
  /** Пауза между попытками, мс */
  delayMs: number;
  /** Вызывается перед каждой повторной попыткой */
  onRetry?: (attempt: number, error: unknown) => void;
}

export function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

export function isTruthy(value: unknown): boolean {
  return value === true || value === 'true';
}

/**
 * Выполняет действие и при ошибке повторяет его — всего до `attempts` попыток с паузой `delayMs`
 *
 * Если все попытки неудачны, наружу уходит последняя ошибка как есть
 */
export async function retry<T>(
  action: () => Promise<T>,
  options: RetryOptions,
  attempt = 1,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (attempt >= options.attempts) {
      throw error;
    }

    options.onRetry?.(attempt, error);
    await wait(options.delayMs);

    return retry(action, options, attempt + 1);
  }
}
