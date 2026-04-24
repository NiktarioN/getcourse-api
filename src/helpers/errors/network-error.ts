import GetCourseError from './error.ts';

/**
 * Сетевая ошибка — проблемы с подключением (таймаут, DNS, connection refused)
 */
export default class GetCourseNetworkError extends GetCourseError {
  /** Исходная ошибка */
  override readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'GetCourseNetworkError';
    this.cause = cause;
  }
}
