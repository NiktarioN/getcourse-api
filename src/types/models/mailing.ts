import type { BooleanLike } from '../common.ts';

/** Тип рассылки */
export type MailingType =
  | 'manual' // Ручная
  | 'notification' // Уведомление
  | 'queue' // Рассылка из очереди
  | 'template'; // Рассылка на основе шаблона

/** Состояние рассылки */
export type MailingState =
  | 1 // Черновик
  | 2 // Периодическая
  | 3 // Не начата
  | 4 // Запущена
  | 5 // Завершена
  | 6 // Ожидает подтверждения
  | 7; // Отправлена

/** Транспорт рассылки */
export type MailingTransport =
  | 'email'
  | 'ticket'
  | 'sms'
  | 'vk'
  | 'max'
  | 'whatsapp'
  | 'chatium'
  | 'fb_messenger';

/** ID транспорта рассылки в статистике */
export type MailingTransportId =
  | 1 // email
  | 2 // sms
  | 3 // ticket
  | 4 // fb_messenger
  | 5 // vk
  | 6 // GetCourse Mobile
  | 7 // whatsapp
  | 13; // max

/** Ожидание перед отправкой */
export interface MailingWaitFor {
  enabled: string;
  weekday: string;
  hour: string;
  minute: string;
}

/**
 * Настройки рассылки
 *
 * Набор полей зависит от типа и транспорта рассылки: ни одно поле не приходит у всех
 */
export interface MailingParams {
  /** Кому отправлять */
  recipients_type?: 'nobody' | 'segment' | 'all';
  /** На какие адреса */
  send_to?: 'all' | 'confirmed_address' | 'exists_address';
  /** Отправитель */
  send_from?: string;
  /** Редактор */
  design_type?: 'editor' | 'templates';
  /** ID шаблона строкой, пустая строка — без шаблона */
  template_id?: string;
  /** Обновлять содержимое при отправке */
  content_update?: boolean;
  /** Когда обновлено содержимое */
  content_update_at?: string;
  /** Подтверждение отправки */
  confirm?: 0 | 1;
  /** Оборачивать ссылки */
  wrap_links?: BooleanLike;
  /** Считать переходы по ссылкам */
  click_wrap_links?: BooleanLike;
  /** Отключить предпросмотр ссылок */
  disable_links_preview?: BooleanLike;
  /** Ожидание перед отправкой, без настроек приходит `[]` */
  wait_for?: MailingWaitFor | [];
  /** Остальные поля зависят от типа и транспорта рассылки */
  [key: string]: unknown;
}

/** Рассылка */
export interface Mailing {
  id: number;
  title: string;
  group_name: string | null;
  type: MailingType;
  transport: MailingTransport;
  category_id: number;
  created_at: string;
  deleted_at: string | null;
  from_user_id: number;
  parent_id: number | null;
  /** Контекст рассылки */
  object_type: 'UserContext' | 'DealContext' | 'UserProductContext';
}

/** Рассылка с настройками — ответ `getMailings({ showInfo: true })` */
export interface MailingWithParams extends Mailing {
  /** У уведомлений без настроек приходит `[]` */
  params: MailingParams | [];
}

/** Содержимое рассылки */
export interface MailingContent {
  id: number;
  /** Тема, может быть пустой строкой */
  subject: string;
  content: string;
  /** Вложения JSON-строкой вида `{"files":[…]}` */
  files: string;
}

/** Статистика рассылки */
export interface MailingStat {
  id: number;
  ACCOUNT_ID: number;
  created_at: string;
  updated_at: string;
  /** У части рассылок типа `template` не приходит */
  calculated_at?: string | null;
  state: MailingState;
  /** У части рассылок типа `template` не приходит */
  deleted?: number;
  /** У части рассылок типа `template` не приходит */
  deleted_at?: string | null;
  cnt_total: number;
  cnt_sent: number;
  /** У части рассылок типа `template` не приходит */
  cnt_in_queue?: number;
  cnt_in_progress: number;
  cnt_cancelled: number;
  cnt_restricted: number;
  cnt_answered: number;
  cnt_errors: number;
  cnt_viewed: number;
  cnt_clicked: number;
  cnt_new: number;
  cnt_unsubscribed: number;
  transport_id: MailingTransportId;
}
