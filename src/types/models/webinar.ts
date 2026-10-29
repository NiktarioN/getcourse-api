/** Параметры вебинара */
export interface WebinarParam {
  title: string;
  teaser_description: string;
  show_page_login: number;
}

/** Тип вебинара */
export type WebinarType = 'hangouts' | 'bigbluebutton';

/** Статус вебинара */
export type WebinarStatus = 'new' | 'opened' | 'finished' | 'closed';

/** Вебинар */
export interface Webinar {
  id: number;
  user_id: number;
  name: string;
  status: WebinarStatus;
  created_at: string;
  type: WebinarType;
  subtype: number;
  scenario_id: number;
  disabled_comments: number;
  access_type: number;
  url_redirrect: string;
  slide_id: string;
  view_type: number;
  isolated_chat: number;
  type_schedule: number;
  params: WebinarParam;
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
