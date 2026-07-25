/** Ответ от запроса импорта */
export interface LegacyImportApiResponse<T> {
  success: boolean;
  action: string;
  result: T;
  error?: string;
}

/** Ответ от запроса экспорта */
export interface LegacyExportApiResponse<T> {
  success: boolean;
  info: T;
  error: boolean;
  error_message: string;
  error_code?: number;
}

/** Ограничение для типа-результата импорта: поля для error-проверки */
export interface LegacyImportResult {
  error?: boolean | string;
  error_message?: string;
}

/** Формат даты YYYY-MM-DD (для фильтров экспорта, дат групп) */
export type DateOnly = `${number}-${number}-${number}`;

/** Формат даты и времени YYYY-MM-DD HH:MM:SS (для дат создания/оплаты заказов) */
export type DateTime = `${number}-${number}-${number} ${number}:${number}:${number}`;

/** Действие Legacy API */
export type LegacyAction = 'add' | 'update' | 'get';

/** Статус заказа (deal_status) */
export type LegacyDealStatus =
  | 'new'
  | 'pending'
  | 'in_work'
  | 'not_confirmed'
  | 'payment_waiting'
  | 'waiting_for_return'
  | 'part_payed'
  | 'payed'
  | 'cancelled'
  | 'false';

/** Статус пользователя в базе */
export type LegacyUserStatus = 'active' | 'in_base';

/** Статус платежа (payment_status) */
export type LegacyPaymentStatus =
  | 'expected'
  | 'accepted'
  | 'returned'
  | 'tobalance'
  | 'frombalance'
  | 'returned_to_balance';
