/**
 * Типы для Legacy API (старое API GetCourse)
 * Документация: https://getcourse.ru/help/api
 */

// ─── Внутренние ответы ─────────────────────────────────────

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

// ─── Форматы дат ──────────────────────────────────────────────────────────────

/** Формат даты YYYY-MM-DD (для фильтров экспорта, дат групп) */
export type DateOnly = `${number}-${number}-${number}`;

/** Формат даты и времени YYYY-MM-DD HH:MM:SS (для дат создания/оплаты заказов) */
export type DateTime = `${number}-${number}-${number} ${number}:${number}:${number}`;

// ─── Перечисления ─────────────────────────────────────────────────────────────

/** Действие Legacy API */
export type LegacyAction = 'add' | 'update' | 'get';

/** Статус заказа (deal_status) */
type DealStatus =
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
type UserStatus = 'active' | 'in_base';

/** Статус платежа (payment_status) */
type PaymentStatus =
  | 'expected'
  | 'accepted'
  | 'returned'
  | 'tobalance'
  | 'frombalance'
  | 'returned_to_balance';

/** Коды методов оплаты (payment_type) */
type PaymentType =
  | '2CO'
  | 'ALFA'
  | 'bepaid'
  | 'BILL'
  | 'CARD'
  | 'CARD_TERMINAL'
  | 'CASH'
  | 'cloud_payments'
  | 'cloud_payments_kz'
  | 'fondy'
  | 'hutki_grosh'
  | 'interkassa'
  | 'INTERNAL'
  | 'justclick'
  | 'kvit'
  | 'mandarinpay'
  | 'OTHER'
  | 'payanyway'
  | 'PAYPAL'
  | 'perfect_money'
  | 'PERFECTMONEY'
  | 'platim'
  | 'QIWI'
  | 'qiwi_kassa'
  | 'QUICKTRANSFER'
  | 'RBK'
  | 'rbkmoney'
  | 'rbkmoney_new'
  | 'ROBOKASSA'
  | 'SBER'
  | 'sberbank'
  | 'stripe'
  | 'tinkoff'
  | 'tinkoffcredit'
  | 'VIRTUAL'
  | 'walletone'
  | 'wayforpay'
  | 'WEBMONEY'
  | 'yandex_kassa'
  | 'YANDEXMONEY'
  | 'zpayment'
  | 'ebanx'
  | 'swedbank';

/** Коды валют (deal_currency) */
type DealCurrency =
  | 'RUB'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'BYR'
  | 'BYN'
  | 'KZT'
  | 'UAH'
  | 'AUD'
  | 'DKK'
  | 'CHF'
  | 'SEK'
  | 'ZAR'
  | 'AMD'
  | 'RON'
  | 'BRL'
  | 'ILS'
  | 'MYR'
  | 'SGD'
  | 'KGS'
  | 'CAD'
  | 'MXN'
  | 'JPY'
  | 'UZS'
  | 'PLN'
  | 'AZN'
  | 'AED'
  | 'TRY'
  | 'INR'
  | 'RSD'
  | 'CZK'
  | 'MNT'
  | 'NZD'
  | 'BGN'
  | 'IDR'
  | 'CNY'
  | 'GEL'
  | 'COP'
  | 'ARS'
  | 'PEN'
  | 'CLP'
  | 'VND'
  | 'PHP'
  | 'DOP'
  | 'KRW'
  | 'TWD'
  | 'MDL'
  | 'TJS'
  | 'NOK'
  | 'NGN'
  | 'HKD';

// ─── Параметры запросов ───────────────────────────────────────────────────────

/** Данные пользователя */
export interface LegacyUserParams {
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  country?: string;
  group_name?: (string | [string, DateOnly | DateTime])[];
  addfields?: Record<string, string>;
}

/** Системные параметры */
export interface LegacySystemParams {
  refresh_if_exists?: 1 | 0;
  partner_email?: string;
  multiple_offers?: 1 | 0;
  return_payment_link?: 1 | 0;
  return_deal_number?: 1 | 0;
}

/** Параметры сессии/UTM */
export interface LegacySessionParams {
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_campaign?: string;
  utm_group?: string;
  gcpc?: string;
  gcao?: string;
  referer?: string;
}

/** Запрос на создание/обновление пользователя */
export interface AddUserRequest {
  user: LegacyUserParams;
  system?: LegacySystemParams;
  session?: LegacySessionParams;
}

/** Базовые параметры сделки */
interface BaseDealParams {
  deal_number?: string;
  offer_code?: string;
  offer_id?: string;
  product_title?: string;
  product_description?: string;
  quantity?: number;
  deal_cost?: string;
  deal_status?: DealStatus;
  deal_is_paid?: 1 | 0;
  manager_email?: string;
  deal_created_at?: DateTime;
  deal_finished_at?: DateTime;
  deal_comment?: string;
  payment_type?: PaymentType;
  payment_status?: PaymentStatus;
  partner_email?: string;
  addfields?: Record<string, string>;
  deal_currency?: DealCurrency;
  funnel_id?: string;
  funnel_stage_id?: string;
}

/** Создание сделки по уникальному коду предложения */
interface DealByOfferCode extends BaseDealParams {
  offer_code: string;
  deal_cost: string;
}

/** Создание сделки по ID предложения */
interface DealByOfferId extends BaseDealParams {
  offer_id: string;
}

/** Параметры сделки (offer_code + deal_cost ИЛИ offer_id обязательны) */
export type LegacyDealParams = DealByOfferCode | DealByOfferId;

/** Запрос на создание сделки */
export interface CreateDealRequest {
  user: LegacyUserParams;
  deal: LegacyDealParams;
  system?: LegacySystemParams;
  session?: LegacySessionParams;
}

// ─── Результаты импорта ───────────────────────────────────────────────────────

/** Результат добавления пользователя */
export interface AddUserResult {
  user_id: number;
  success: boolean | string;
  error: boolean | string;
  error_message: string;
}

/** Результат создания сделки */
export interface CreateDealResult {
  deal_id: number;
  deal_number: string;
  success: boolean | string;
  user_id: number;
  error: boolean | string;
  error_message: string;
}

// ─── Кастомные поля ──────────────────────────────────────────────────────────

/** Кастомное поле аккаунта */
export interface CustomField {
  id: number;
  type: string;
  title: string;
  required: 0 | 1;
  field_order_pos: number;
  form_id: number;
  context_type: string;
}

// ─── Фильтры экспорта ────────────────────────────────────────────────────────

/** Диапазон дат для фильтров */
export interface DateRange {
  from?: DateOnly;
  to?: DateOnly;
}

/** Фильтры экспорта пользователей */
export interface ExportUsersFilters {
  created_at?: DateRange;
  status?: UserStatus;
  email?: string;
  idgrouplist?: 'id' | 'id_date';
}

/** Фильтры экспорта пользователей группы */
export interface ExportGroupUsersFilters {
  created_at?: DateRange;
  status?: UserStatus;
  added_at?: DateRange;
}

/** Фильтры экспорта сделок */
export interface ExportDealsFilters {
  created_at?: DateRange;
  status?: DealStatus;
  payed_at?: DateRange;
  finished_at?: DateRange;
  status_changed_at?: DateRange;
  user_id?: string;
  user_in_group?: string;
}

/** Фильтры экспорта платежей */
export interface ExportPaymentsFilters {
  created_at?: DateRange;
  status?: PaymentStatus;
  status_changed_at?: DateRange;
}

// ─── Экспорт ──────────────────────────────────────────────────────────────────

/** Результат запуска экспорта */
export interface ExportInfo {
  export_id: number;
}

/** Данные завершённого экспорта */
export interface ExportedData {
  fields: string[];
  items: string[][];
}

/** Настройки поллинга экспорта */
export interface ExportPollingOptions {
  /** Интервал между запросами в мс (по умолчанию: 30000) */
  pollInterval?: number;
  /** Максимальное время ожидания в мс (по умолчанию: 300000) */
  timeout?: number;
}
