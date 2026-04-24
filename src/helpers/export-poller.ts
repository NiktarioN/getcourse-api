import GetCourseApiError from './errors/api-error.ts';

import type { ApiResponse, Logger } from '../types/common.ts';
import type { ExportedData, ExportPollingOptions } from '../types/legacy.ts';

const DEFAULT_POLL_INTERVAL = 30_000;
const DEFAULT_POLL_TIMEOUT = 300_000;

/**
 * Поллинг результатов экспорта Legacy API
 *
 * Экспорт в старом API асинхронный — сначала возвращается export_id,
 * затем нужно повторно запрашивать результат пока экспорт не завершится.
 *
 * Лимит Export API: 100 запросов за 2 часа
 *
 * По умолчанию: интервал 30 сек, таймаут 5 минут
 */
export default class ExportPoller {
  private readonly fetchResult: (exportId: number) => Promise<ApiResponse<ExportedData>>;

  private readonly logger: Logger;

  constructor(
    fetchResult: (exportId: number) => Promise<ApiResponse<ExportedData>>,
    logger: Logger,
  ) {
    this.fetchResult = fetchResult;
    this.logger = logger;
  }

  /**
   * Ожидает завершения экспорта и возвращает данные с названиями колонок
   */
  async poll(exportId: number, options?: ExportPollingOptions): Promise<ApiResponse<ExportedData>> {
    const interval = options?.pollInterval ?? DEFAULT_POLL_INTERVAL;
    const timeout = options?.timeout ?? DEFAULT_POLL_TIMEOUT;
    const startAt = Date.now();

    return this.pollOnce(exportId, interval, timeout, startAt);
  }

  private async pollOnce(
    exportId: number,
    interval: number,
    timeout: number,
    startAt: number,
  ): Promise<ApiResponse<ExportedData>> {
    if (Date.now() - startAt >= timeout) {
      throw new GetCourseApiError({
        message: `Таймаут ожидания экспорта (export_id: ${exportId})`,
        statusCode: 200,
        apiCode: 0,
        errors: [`Превышено время ожидания ${timeout}мс для экспорта ${exportId}`],
      });
    }

    try {
      const response = await this.fetchResult(exportId);

      this.logger.debug(`Поллинг экспорта ${exportId}: экспорт готов`);

      return response;
    } catch (error) {
      if (error instanceof GetCourseApiError && error.apiCode === 909) {
        this.logger.debug(`Поллинг экспорта ${exportId}: не готов (909), ждём ${interval}мс`);

        await new Promise((resolve) => {
          setTimeout(resolve, interval);
        });

        return this.pollOnce(exportId, interval, timeout, startAt);
      }

      throw error;
    }
  }
}
