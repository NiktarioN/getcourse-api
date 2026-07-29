import type { WebinarUserType } from '../models/webinar.ts';

/** Получить вебинары по ID */
export interface GetWebinarsByIdsRequest {
  /** Массив ID вебинаров */
  ids: number[];
}

/** Отправить сообщение в чат вебинара */
export interface SendWebinarMessageRequest {
  /** ID пользователя-модератора / автора сообщения */
  moderatorId: number;
  /** ID вебинара */
  webinarId: number;
  /** Текст сообщения */
  text: string;
  /** ID запущенного автовебинара (для типов "Частые параллельные запуски" или "По расписанию") */
  webinarLaunchNumber?: number;
  /** Ответить лично */
  isPrivateReply?: boolean;
  /** ID пользователя, на сообщение которого отвечаем */
  replyToUserId?: number;
  /** Тип пользователя, на сообщение которого отвечаем */
  replyToUserType?: number;
}

/** Действие модерации сообщения в чате вебинара */
export type WebinarMessageModerationAction =
  | 'delete'
  | 'premoderation_accept'
  | 'premoderation_reject'
  | 'premoderation_reject_all';

/** Модерация сообщения в чате вебинара */
export interface ModerateWebinarMessageRequest {
  /** ID вебинара */
  webinarId: number;
  /** ID сообщения в чате вебинара */
  commentId: number;
  /** Действие модерации */
  action: WebinarMessageModerationAction;
  /** ID пользователя-модератора */
  moderatorId: number;
}

/** Действие модерации пользователя вебинара */
export type WebinarUserModerationAction = 'isolation' | 'isolation_remove';

/** Модерация пользователя вебинара */
export interface ModerateWebinarUserRequest {
  /** ID вебинара */
  webinarId: number;
  /** ID пользователя */
  userId: number;
  /** Тип пользователя */
  userType: WebinarUserType;
  /** Действие модерации */
  action: WebinarUserModerationAction;
  /** ID запущенного автовебинара (для типов "Частые параллельные запуски" или "По расписанию") */
  webinarLaunchNumber?: number;
  /** ID пользователя-модератора */
  moderatorId: number;
}
