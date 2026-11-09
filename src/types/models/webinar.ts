import type { DealStatus } from './deal.ts';
import type { CurrencyType } from '../dictionaries.ts';

/** Параметры вебинара */
export interface WebinarParam {
  title: string;
  teaser_description: string;
  show_page_login: string;
}

/** Тип вебинара */
export type WebinarType = 'hangouts' | 'bigbluebutton';

/** Вид вебинара */
export type WebinarSubtype = 'LiveWebinar' | 'AutoWebinar';

/** Статус вебинара */
export type WebinarStatus = 'new' | 'opened' | 'started' | 'finished' | 'closed';

/** Вебинар из getWebinars */
export interface Webinar {
  id: number;
  user_id: number;
  name: string;
  status: WebinarStatus;
  created_at: string;
  type: WebinarType;
  subtype: WebinarSubtype;
  scenario_id: number | null;
  disabled_comments: number;
  access_type: number;
  view_type: number;
  isolated_chat: number;
  type_schedule: number;
  params: WebinarParam;
}

/** Вебинар из getWebinarsByIds — subtype числом: 1 — живой, 2 — автовебинар */
export interface WebinarById extends Omit<Webinar, 'subtype'> {
  subtype: 1 | 2;
}

/** Тип пользователя вебинара */
export type WebinarUserType = 1 | 2;

/** Сообщение в чате вебинара */
export interface WebinarChatMessage {
  webinarId: number;
  /** Текст сообщения */
  message: string;
  /** ID отправителя */
  userId: number;
  userType: WebinarUserType;
  uniqId: string;
  /** Отправитель — сотрудник школы */
  isWorker: boolean;
  /** У сообщений, отправленных через API, всегда null */
  sessionId: string | null;
  isUserBanned: boolean;
  /** Кому адресован личный ответ, у общего сообщения null */
  userToId: number | null;
  userToType: WebinarUserType | null;
  launchId: number;
  /** Время создания, unix-таймстамп */
  created: number;
  shouldBePreModerated: boolean;
  shouldBeIsolated: boolean;
  /** Личный ответ — виден только адресату */
  isPrivate: boolean;
}

/**
 * Результат отправки сообщения в чат вебинара
 *
 * Созданное сообщение лежит под числовым ключом — вживую всегда приходил 0
 */
export type SentWebinarMessageResult =
  | { result: true; comment_id: number; [index: number]: WebinarChatMessage }
  | { result: false };

/** Визит участника на вебинар */
export interface WebinarVisit {
  /** Время входа */
  s: string;
  /** Время выхода */
  e: string;
  session_id: number;
  device: string;
  browser: string;
  os: string;
}

/** Присутствие участника на вебинаре */
export interface WebinarPresence {
  view: number;
  viewTill: number;
  finished: boolean;
  total_minutes: number;
  visits: WebinarVisit[];
}

/** Комментарий участника в статистике вебинара */
export interface WebinarStatsComment {
  created_at: string;
  comment_id: number;
  text: string;
  status: number;
  is_deleted: 0 | 1;
}

/** Клик участника в статистике вебинара */
export interface WebinarStatsClick {
  target_id: number;
  action_at: string;
}

/** Заказ участника в статистике вебинара */
export interface WebinarStatsDeal {
  created_at: string;
  id: number;
  cost: number;
  status: DealStatus;
  /** Где создан заказ, текстом */
  created: string;
}

/** Платёж участника в статистике вебинара */
export interface WebinarStatsPayment {
  id: number;
  deal_id: number;
  amount: number;
  currency: CurrencyType;
  created_at: string;
}

/** presence участника: с show_presence — объект или null, без него — [] */
export type WebinarStatsPresence = WebinarPresence | null | [];

/** Участник в статистике вебинара */
export interface WebinarStatsUser<T extends WebinarStatsPresence = WebinarStatsPresence> {
  /** У гостя null */
  user_id: number | null;
  webinar_user_id: number;
  user_type: WebinarUserType;
  name: string;
  /** У гостя null */
  email: string | null;
  /** У гостя null, бывает пустой строкой */
  phone: string | null;
  presence: T;
  /** Без show_comments — [] */
  comments: WebinarStatsComment[];
  /** Без show_clicks — [] */
  clicks: WebinarStatsClick[];
  /** Без show_deals — [] */
  deals: WebinarStatsDeal[];
  /** Без show_payments — [] */
  payments: WebinarStatsPayment[];
  is_isolated: boolean;
}

/** Статистика участников вебинара */
export interface WebinarStats<T extends WebinarStatsPresence = WebinarStatsPresence> {
  webinarId: number;
  launchNumber: number;
  users: WebinarStatsUser<T>[];
}
