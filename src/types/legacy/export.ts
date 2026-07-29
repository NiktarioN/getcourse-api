import type {
  DateOnly,
  LegacyDealStatus,
  LegacyPaymentStatus,
  LegacyUserStatus,
} from './common.ts';

/** Кастомное поле аккаунта */
export interface LegacyCustomField {
  id: number;
  type: string;
  title: string;
  required: 0 | 1;
  field_order_pos: number;
  params: string;
  form_id: number;
  context_type: string;
}

/** Диапазон дат для фильтров */
export interface DateRange {
  from?: DateOnly;
  to?: DateOnly;
}

/** Фильтры экспорта пользователей */
export interface ExportUsersFilters {
  created_at?: DateRange;
  status?: LegacyUserStatus;
  email?: string;
  idgrouplist?: 'id' | 'id_date';
}

/** Фильтры экспорта пользователей группы */
export interface ExportGroupUsersFilters {
  created_at?: DateRange;
  status?: LegacyUserStatus;
  added_at?: DateRange;
}

/** Фильтры экспорта сделок */
export interface ExportDealsFilters {
  created_at?: DateRange;
  status?: LegacyDealStatus;
  payed_at?: DateRange;
  finished_at?: DateRange;
  status_changed_at?: DateRange;
  user_id?: string;
  user_in_group?: string;
}

/** Фильтры экспорта платежей */
export interface ExportPaymentsFilters {
  created_at?: DateRange;
  status?: LegacyPaymentStatus;
  status_changed_at?: DateRange;
}

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
