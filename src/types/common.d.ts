/**
 * Базовый ответ от API GetCourse
 */
interface ResultResponse {
  status: boolean;
  message: string;
  code: number;
  errors: string[];
}

/**
 * Типизированный ответ с данными
 */
interface ApiResponse<T> extends ResultResponse {
  data: T;
}

/**
 * Идентификатор пользователя — можно передать userId ИЛИ email
 */
interface UserIdentifier {
  userId?: number;
  email?: string;
}

/**
 * Параметры пагинации
 */
interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Интерфейс логгера — совместим с winston, pino, console и любым другим логгером
 */
interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void;
  info: (message: string, context?: Record<string, unknown>) => void;
  warn: (message: string, context?: Record<string, unknown>) => void;
  error: (message: string, context?: Record<string, unknown>) => void;
}

/**
 * Конфигурация клиента
 */
interface GetCourseConfig {
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
  /** Кастомная реализация fetch (для тестов, прокси и т.д.) */
  fetch?: typeof globalThis.fetch;
}
