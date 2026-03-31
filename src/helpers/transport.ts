import axios, { AxiosError } from 'axios';
import { GetCourseApiError, GetCourseNetworkError } from './errors.ts';
import ConsoleLogger from './logger.ts';

import type { AxiosInstance } from 'axios';
import type { ApiResponse, Logger } from '../types/common.ts';

const DEFAULT_TIMEOUT = 15_000;

interface HttpTransportConfig {
  baseUrl: string;
  token: string;
  timeout?: number | undefined;
  logLevel?: 'silent' | 'error' | 'debug' | undefined;
  logger?: Logger | undefined;
}

/**
 * HTTP транспорт — отвечает за все запросы к API GetCourse
 */
export default class HttpTransport {
  private readonly client: AxiosInstance;

  private readonly logger: Logger;

  constructor(config: HttpTransportConfig) {
    this.logger = config.logger ?? new ConsoleLogger(config.logLevel);

    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      headers: { Authorization: config.token },
    });
  }

  /**
   * GET-запрос к API
   */
  async get<T>(path: string, params?: object): Promise<ApiResponse<T>> {
    return this.execute<T>('GET', path, async () =>
      this.client.get<ApiResponse<T>>(path, {
        params: params === undefined ? undefined : HttpTransport.filterParams(params),
      }),
    );
  }

  /**
   * POST-запрос к API с JSON телом
   */
  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.execute<T>(
      'POST',
      path,
      async () => this.client.post<ApiResponse<T>>(path, body),
      body === undefined ? undefined : { body },
    );
  }

  /**
   * Убирает undefined/null/'' из объекта параметров перед отправкой
   */
  private static filterParams(params: object): Record<string, string> {
    const result: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = String(value);
      }
    });

    return result;
  }

  /**
   * Выполняет HTTP-запрос к API: логирует вызов, парсит ответ и нормализует ошибки
   */
  private async execute<T>(
    method: string,
    path: string,
    request: () => Promise<{ data: ApiResponse<T> }>,
    logContext?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    this.logger.debug(`${method} ${path}`, logContext);

    const startAt = Date.now();

    try {
      const { data } = await request();

      // API может вернуть HTTP 200, но status: false в теле
      if (!data.status) {
        const message = data.message ?? 'Ошибка API';
        const errors = Array.isArray(data.errors) ? data.errors : [];

        this.logger.error(`API вернул status: false — ${message}`, { errors });

        throw new GetCourseApiError({
          message,
          statusCode: 200,
          apiCode: data.code ?? 0,
          errors,
        });
      }

      this.logger.debug(`${method} ${path} → 200 (${Date.now() - startAt}ms)`);

      return data;
    } catch (error) {
      if (error instanceof GetCourseApiError || error instanceof GetCourseNetworkError) {
        throw error;
      }

      if (error instanceof AxiosError && error.response !== undefined) {
        const { response } = error;
        const body = response.data as Partial<ApiResponse<unknown>>;
        const message = body.message ?? `HTTP ${response.status}`;
        const errors = Array.isArray(body.errors) ? body.errors : [];

        this.logger.error(`API вернул ошибку ${response.status}: ${message}`, { errors });

        throw new GetCourseApiError({
          message,
          statusCode: response.status,
          apiCode: body.code ?? response.status,
          errors,
        });
      }

      this.logger.error(`${method} ${path} → сетевая ошибка`, { error: String(error) });

      throw new GetCourseNetworkError(`Ошибка сети при ${method} ${path}: ${String(error)}`, error);
    }
  }
}
