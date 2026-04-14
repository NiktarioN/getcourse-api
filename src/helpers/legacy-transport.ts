import axios from 'axios';
import { GetCourseApiError, GetCourseNetworkError } from './errors.ts';
import ConsoleLogger from './logger.ts';
import { isPresent, isTruthy } from './utils.ts';

import type { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse, Logger } from '../types/common.ts';
import type {
  LegacyAction,
  LegacyExportApiResponse,
  LegacyImportApiResponse,
  LegacyImportResult,
} from '../types/legacy.ts';

const DEFAULT_TIMEOUT = 15_000;

interface LegacyTransportConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  logLevel?: 'silent' | 'error' | 'debug';
  logger?: Logger;
}

/**
 * HTTP транспорт для Legacy API GetCourse
 *
 * Формат запросов:
 * - Импорт: POST form-urlencoded с key, action, params (base64 JSON)
 * - Экспорт: GET с key и фильтрами в query params
 *
 * Ответы нормализуются к ApiResponse<T>
 */
export default class LegacyTransport {
  private readonly client: AxiosInstance;

  private readonly apiKey: string;

  private readonly logger: Logger;

  constructor(config: LegacyTransportConfig) {
    this.apiKey = config.apiKey;
    this.logger = config.logger ?? new ConsoleLogger(config.logLevel);

    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
    });
  }

  /**
   * POST-запрос импорта: form-urlencoded с base64-кодированными параметрами
   */
  async importRequest<T extends LegacyImportResult>(
    endpoint: string,
    action: LegacyAction,
    params: object,
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(
      'POST',
      endpoint,
      async () => {
        const body = new URLSearchParams();

        body.append('key', this.apiKey);
        body.append('action', action);
        body.append('params', LegacyTransport.encodeParams(params));

        const response = await this.client.post<LegacyImportApiResponse<T>>(
          endpoint,
          body.toString(),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        );

        return { data: LegacyTransport.normalizeImportResponse<T>(response.data) };
      },
      { action, params },
    );
  }

  /**
   * GET-запрос экспорта: key + фильтры в query params
   */
  async exportRequest<T>(endpoint: string, filters?: object): Promise<ApiResponse<T>> {
    return this.execute<T>(
      'GET',
      endpoint,
      async () => {
        const params: Record<string, string> = { key: this.apiKey };

        if (filters !== undefined) {
          Object.assign(params, LegacyTransport.flattenFilters(filters));
        }

        const response = await this.client.get<LegacyExportApiResponse<T>>(endpoint, { params });

        return { data: LegacyTransport.normalizeExportResponse<T>(response.data) };
      },
      filters === undefined ? undefined : { filters },
    );
  }

  /**
   * GET-запрос результата экспорта по ID
   */
  async getExportResult<T>(exportId: number): Promise<ApiResponse<T>> {
    return this.execute<T>('GET', `account/exports/${exportId}`, async () => {
      const response = await this.client.get<LegacyExportApiResponse<T>>(
        `account/exports/${exportId}`,
        { params: { key: this.apiKey } },
      );

      return { data: LegacyTransport.normalizeExportResponse<T>(response.data) };
    });
  }

  /**
   * Base64-кодирование параметров
   */
  private static encodeParams(params: object): string {
    return Buffer.from(JSON.stringify(params)).toString('base64');
  }

  /**
   * Развёртывание вложенных фильтров: { created_at: { from: '...' } } → { 'created_at[from]': '...' }
   */
  private static flattenFilters(obj: object, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (!isPresent(value)) {
        return;
      }

      const paramKey = prefix === '' ? key : `${prefix}[${key}]`;

      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, LegacyTransport.flattenFilters(value as object, paramKey));

        return;
      }

      result[paramKey] = String(value);
    });

    return result;
  }

  /**
   * Нормализация ответа импорта
   */
  private static normalizeImportResponse<T extends LegacyImportResult>(
    response: LegacyImportApiResponse<T>,
  ): ApiResponse<T> {
    const success = isTruthy(response.success);
    const hasError = isTruthy(response.result.error);

    if (!success || hasError) {
      const message = response.result.error_message ?? response.error ?? 'Ошибка Legacy API';

      throw new GetCourseApiError({
        message,
        statusCode: 200,
        apiCode: 0,
        errors: message === '' ? [] : [message],
      });
    }

    return {
      status: true,
      message: response.action ?? 'OK',
      code: 0,
      errors: [],
      data: response.result,
    };
  }

  /**
   * Нормализация ответа экспорта
   */
  private static normalizeExportResponse<T>(response: LegacyExportApiResponse<T>): ApiResponse<T> {
    const success = isTruthy(response.success);

    if (!success) {
      const message = response.error_message ?? 'Ошибка Legacy API';

      throw new GetCourseApiError({
        message,
        statusCode: 200,
        apiCode: response.error_code ?? 0,
        errors: message === '' ? [] : [message],
      });
    }

    return {
      status: true,
      message: 'OK',
      code: 0,
      errors: [],
      data: response.info,
    };
  }

  /**
   * Обёртка запросов: логирование + обработка ошибок
   */
  private async execute<T>(
    method: string,
    path: string,
    request: () => Promise<{ data: ApiResponse<T> }>,
    logContext?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    this.logger.debug(`Legacy ${method} ${path}`, logContext);

    const startAt = Date.now();

    try {
      const { data } = await request();

      this.logger.debug(`Legacy ${method} ${path} → 200 (${Date.now() - startAt}мс)`);

      return data;
    } catch (error) {
      if (error instanceof GetCourseApiError || error instanceof GetCourseNetworkError) {
        throw error;
      }

      const axiosError = error as AxiosError;

      if (axiosError.response !== undefined) {
        const message = `HTTP ${axiosError.response.status}`;

        this.logger.error(`Legacy API вернул ошибку ${axiosError.response.status}`, { path });

        throw new GetCourseApiError({
          message,
          statusCode: axiosError.response.status,
          apiCode: axiosError.response.status,
          errors: [message],
        });
      }

      this.logger.error(`Legacy ${method} ${path} → сетевая ошибка`, { error: String(error) });

      throw new GetCourseNetworkError(
        `Ошибка сети при Legacy ${method} ${path}: ${String(error)}`,
        error,
      );
    }
  }
}
