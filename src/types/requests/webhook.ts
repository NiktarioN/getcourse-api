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
