import type { WebhookEventBase } from './base.ts';
import type { WebinarUserType } from '../models/webinar.ts';

/** Пользователь в теле вебхука вебинара */
interface WebhookWebinarUser {
  /** Составной ID вида "<accountId>:<userId>" */
  id: string;
  gcId: number;
  type: WebinarUserType;
  email: string;
}

/** Комментарий в чате вебинара */
interface WebhookWebinarComment {
  /** ID комментария. Приходит строкой, хотя значение числовое */
  id: string;
  text: string;
  /** Время создания, ISO 8601 */
  createdAt: string;
  user_to_id: number | null;
  user_to_type: WebinarUserType | null;
  /**
   * Видимость комментария:
   * 1 - видно всем, 2 - скрыто
   * Встречаются также 3 и 4, назначение неизвестно
   */
  visibility: number;
  webinar_id: number;
  webinar_launch_number: number;
}

/** Добавлен комментарий на вебинаре */
export interface WebinarCommentCreatedWebhook extends WebhookEventBase {
  eventType: 'getcourse/webinarCommentCreated';
  user: WebhookWebinarUser;
  comment: WebhookWebinarComment;
}
