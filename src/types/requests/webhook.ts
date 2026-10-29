/** Карта поддерживаемых событий вебхуков: объект события → допустимые event_id */
interface WebhookEventMap {
  /** Входящие сообщения */
  1: 1 | 2 | 3 | 4;
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
  /** HelpDesk */
  9: 1 | 2 | 3;
}

/** Событие вебхука: URI получателя, объект события и допустимый event_id */
export type WebhookSubscription = {
  [Key in keyof WebhookEventMap]: {
    uri: string;
    event_object_id: Key;
    event_id: WebhookEventMap[Key];
  };
}[keyof WebhookEventMap];

/** Запрос подписки: событие + флаг (1 — подписаться, 0 — отписаться, по умолчанию 1) */
export type SubscribeWebhookRequest = WebhookSubscription & { subscribe?: 0 | 1 };

/** Ответ методов подписки и отписки */
export interface SubscribeWebhookResponse {
  success: 'OK';
}

/** Подписка из списка вебхуков ключа разработчика: событие + школа и флаг подписки */
export type WebhookListItem = WebhookSubscription & {
  /** Системный домен школы */
  account: string;
  /** 1 — подписан, 0 — отписан */
  subscribe: 0 | 1;
};

/** Ответ списка вебхуков и отписки списком */
export interface WebhookListResponse {
  success: 'OK';
  /** Подписки после запроса */
  hooks: WebhookListItem[];
  /** Снятые подписки — заполняется только при отписке */
  unsubscribed: WebhookListItem[];
  /** Элементы запроса, для которых подписка не найдена */
  not_found: WebhookListItem[];
}
