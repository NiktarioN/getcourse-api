/**
 * Базовый ответ от API GetCourse
 */
export interface ResultResponse {
  status: boolean;
  message: string;
  code: number;
  errors: string[];
}

/**
 * Типизированный ответ с данными
 */
export interface ApiResponse<T> extends ResultResponse {
  data: T;
}

/**
 * Идентификатор пользователя — можно передать userId ИЛИ email
 */
export interface UserIdentifier {
  userId?: number;
  email?: string;
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Интерфейс логгера — совместим с winston, pino, console и любым другим логгером
 */
export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
}

/**
 * Конфигурация клиента
 */
export interface GetCourseConfig {
  /** Ключ разработчика (первая часть токена) */
  devKey: string;
  /** Ключ API школы (вторая часть токена) */
  apiKey: string;
  /** Домен школы, например: test.getcourse.ru */
  domain: string;
  /** Таймаут запросов в мс (по умолчанию: 15000) */
  timeout?: number;
  /** Уровень логирования встроенного логгера (по умолчанию: 'silent') */
  logLevel?: 'silent' | 'error' | 'debug';
  /** Кастомный логгер (совместим с winston, pino и т.д.) */
  logger?: Logger;
}
