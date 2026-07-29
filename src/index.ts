import GetCourse from './getcourse.ts';

export default GetCourse;

export { GetCourse };

// Классы ошибок
export { default as GetCourseError } from './helpers/errors/error.ts';

export { default as GetCourseApiError } from './helpers/errors/api-error.ts';

export { default as GetCourseNetworkError } from './helpers/errors/network-error.ts';

export { default as GetCourseValidationError } from './helpers/errors/validation-error.ts';

// Общее: обёртка ответа, конфиг клиента, контракт логгера
export type {
  ActionResult,
  ApiResponse,
  GetCourseConfig,
  Logger,
  PaginationParams,
  UserIdentifier,
  ValidationErrorDetails,
} from './types/common.ts';

// Справочники кодов, общие для всех слоёв
export type * from './types/dictionaries.ts';

// Модели объектов
export type * from './types/models/call.ts';

export type * from './types/models/custom-field.ts';

export type * from './types/models/deal.ts';

export type * from './types/models/dialog.ts';

export type * from './types/models/lesson.ts';

export type * from './types/models/offer.ts';

export type * from './types/models/survey.ts';

export type * from './types/models/training.ts';

export type * from './types/models/user.ts';

export type * from './types/models/webinar.ts';

// Тела запросов
export type * from './types/requests/call.ts';

export type * from './types/requests/deal.ts';

export type * from './types/requests/dialog.ts';

export type * from './types/requests/helpdesk.ts';

export type * from './types/requests/lesson.ts';

export type * from './types/requests/user.ts';

export type * from './types/requests/webhook.ts';

export type * from './types/requests/webinar.ts';

// Тела входящих вебхуков
export type * from './types/webhooks/base.ts';

export type * from './types/webhooks/call.ts';

export type * from './types/webhooks/deal.ts';

export type * from './types/webhooks/dialog.ts';

export type * from './types/webhooks/helpdesk.ts';

export type * from './types/webhooks/lesson.ts';

export type * from './types/webhooks/webinar.ts';

// Legacy API: параметры импорта
export type * from './types/legacy/import.ts';

// Legacy API: форматы дат и статусы
export type {
  DateOnly,
  DateTime,
  LegacyDealStatus,
  LegacyPaymentStatus,
  LegacyUserStatus,
} from './types/legacy/common.ts';

// Legacy API: фильтры и результаты экспорта
export type {
  DateRange,
  ExportDealsFilters,
  ExportedData,
  ExportGroupUsersFilters,
  ExportPaymentsFilters,
  ExportPollingOptions,
  ExportUsersFilters,
  LegacyCustomField,
} from './types/legacy/export.ts';
