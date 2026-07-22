/** Карта поддерживаемых событий setUri: объект события → допустимые event_id */
interface SetUriEventMap {
  /** Входящие сообщения */
  1: 1 | 2 | 3;
  /** Заказы */
  2: 1 | 2 | 3;
  /** Комментарии к урокам */
  4: 1;
  /** Комментарии к ответам */
  5: 1;
  /** Комментарии вебинаров */
  7: 1;
  /** Звонки */
  8: 1;
}

/** Все возможные запросы для метода setUri */
export type SetUriRequest = {
  [Key in keyof SetUriEventMap]: { uri: string } & {
    event_object_id: Key;
    event_id: SetUriEventMap[Key];
  };
}[keyof SetUriEventMap];

/** Ответ метода setUri */
export interface SetUriResponse {
  success: 'OK';
}

// ─── Данные о звонках (event_object_id: 8) ───────────────────────────────────────────────────────────────────

/** Длительность звонка в секундах */
interface WebhookCallAtcDuration {
  billsec: number;
  seconds: number;
}

/** Данные АТС по звонку */
interface WebhookCallAtc {
  to: string;
  date: string;
  atc_id: number;
  caller: string;
  /** Часто встречаются: "Carousel_OnLinePBX", "Carusel", также попадаются номера телефонов и пустая строка */
  gateway: string;
  duration: WebhookCallAtcDuration;
  /** null у коротких звонков без записи разговора */
  file_link: string | null;
  caller_name: string;
  hangup_cause: string;
}

/** Объект звонка */
interface WebhookCallContext {
  id: number;
  type: 'Deal' | 'User';
}

/** Объект звонка */
export interface WebhookCall {
  id: number;
  type: 'call';
  direction: 'outcome' | 'income';
  created_by: 'user' | 'atc';
  created_at: string;
  contact_time: string;
  finish_status: 'contacted' | 'failed';
  failed_reason: 'no_answer' | 'bad_phone' | 'phone_disabled' | null;
  user_id: number;
  manager_user_id: number | null;
  created_user_id: number | null;
  title: string | null;
  comment: string | null;
  description: string | null;
  atc: WebhookCallAtc | null;
  context: WebhookCallContext | null;
}
