import { GetCourseApiError, GetCourseNetworkError } from './errors.ts';
import ConsoleLogger from './logger.ts';

const DEFAULT_TIMEOUT = 15_000;

interface HttpTransportConfig {
  baseUrl: string;
  token: string;
  timeout?: number | undefined;
  logLevel?: 'silent' | 'error' | 'debug' | undefined;
  logger?: Logger | undefined;
  fetch?: typeof globalThis.fetch | undefined;
}

/**
 * HTTP транспорт — отвечает за все запросы к API GetCourse
 */
export default class HttpTransport {
  private readonly baseUrl: string;

  private readonly token: string;

  private readonly timeout: number;

  private readonly logger: Logger;

  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(config: HttpTransportConfig) {
    this.baseUrl = config.baseUrl;
    this.token = config.token;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.logger = config.logger ?? new ConsoleLogger(config.logLevel);
    this.fetchImpl = config.fetch ?? globalThis.fetch;
  }

  /**
   * GET-запрос к API
   */
  async get<T>(path: string, params?: object): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, params);

    return this.execute<T>('GET', path, url, {
      method: 'GET',
      headers: { Authorization: this.token },
    });
  }

  /**
   * POST-запрос к API с JSON телом
   */
  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path);

    return this.execute<T>(
      'POST',
      path,
      url,
      {
        method: 'POST',
        headers: { 'Authorization': this.token, 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
      body === undefined ? undefined : { body },
    );
  }

  /**
   * Строит полный URL с query параметрами (пропускает undefined/null значения)
   */
  private buildUrl(path: string, params?: object): string {
    const url = `${this.baseUrl}/${path}`;

    if (params === undefined) {
      return url;
    }

    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const queryString = query.toString();

    return queryString.length > 0 ? `${url}?${queryString}` : url;
  }

  /**
   * Парсит ответ, проверяет статус и бросает ошибки
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let body: unknown;

    try {
      body = await response.json();
    } catch {
      throw new GetCourseApiError({
        message: `Не удалось разобрать ответ от API (HTTP ${response.status})`,
        statusCode: response.status,
        apiCode: response.status,
        errors: [],
      });
    }

    if (!response.ok) {
      const data = body as Partial<ApiResponse<unknown>>;
      const message = data.message ?? `HTTP ${response.status}`;
      const errors = Array.isArray(data.errors) ? data.errors : [];

      this.logger.error(`API вернул ошибку ${response.status}: ${message}`, { errors });

      throw new GetCourseApiError({
        message,
        statusCode: response.status,
        apiCode: data.code ?? response.status,
        errors,
      });
    }

    const data = body as ApiResponse<T>;

    // API может вернуть HTTP 200, но status: false в теле
    if (!data.status) {
      const message = data.message ?? 'Ошибка API';
      const errors = Array.isArray(data.errors) ? data.errors : [];

      this.logger.error(`API вернул status: false — ${message}`, { errors });

      throw new GetCourseApiError({
        message,
        statusCode: response.status,
        apiCode: data.code ?? 0,
        errors,
      });
    }

    return data;
  }

  /**
   * Выполняет HTTP-запрос к API: логирует вызов, применяет timeout, парсит ответ и нормализует ошибки
   */
  private async execute<T>(
    method: string,
    path: string,
    url: string,
    init: RequestInit,
    logContext?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    this.logger.debug(`${method} ${url}`, logContext);

    const startAt = Date.now();

    try {
      const response = await this.fetchImpl(url, {
        ...init,
        signal: AbortSignal.timeout(this.timeout),
      });

      const result = await this.parseResponse<T>(response);

      this.logger.debug(`${method} ${url} → ${response.status} (${Date.now() - startAt}ms)`);

      return result;
    } catch (error) {
      if (error instanceof GetCourseApiError || error instanceof GetCourseNetworkError) {
        throw error;
      }

      this.logger.error(`${method} ${url} → сетевая ошибка`, { error: String(error) });

      throw new GetCourseNetworkError(`Ошибка сети при ${method} ${path}: ${String(error)}`, error);
    }
  }
}
