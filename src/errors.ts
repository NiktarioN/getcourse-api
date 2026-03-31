/* eslint-disable max-classes-per-file */

/**
 * Базовый класс ошибок SDK
 */
export class GetCourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GetCourseError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Ошибка API — сервер вернул ошибку (status: false, HTTP 4xx/5xx)
 */
export class GetCourseApiError extends GetCourseError {
  /** HTTP статус код */
  readonly statusCode: number;

  /** Код ошибки из тела ответа */
  readonly apiCode: number;

  /** Список ошибок из тела ответа */
  readonly errors: string[];

  constructor(params: { message: string; statusCode: number; apiCode: number; errors: string[] }) {
    super(params.message);
    this.name = 'GetCourseApiError';
    this.statusCode = params.statusCode;
    this.apiCode = params.apiCode;
    this.errors = params.errors;
  }
}

/**
 * Сетевая ошибка — проблемы с подключением (таймаут, DNS, connection refused)
 */
export class GetCourseNetworkError extends GetCourseError {
  /** Исходная ошибка */
  override readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'GetCourseNetworkError';
    this.cause = cause;
  }
}
