import GetCourseError from './error.ts';

/**
 * Ошибка API — сервер вернул ошибку (status: false, HTTP 4xx/5xx)
 */
export default class GetCourseApiError extends GetCourseError {
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
