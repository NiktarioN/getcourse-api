import type { WebhookEventBase } from './base.ts';

/** Данные урока внутри комментария к ответу */
interface WebhookCommentLessonData {
  lesson_id: number;
  lesson_name: string;
  lesson_teacher_id: number | null;
  training_id: number;
  training_name: string;
}

/** Файл во вложении комментария */
export interface WebhookCommentFile {
  hash: string;
  uploaded_at: number;
  user_id: number;
  can_download: boolean;
  interactive: boolean;
  title: string | null;
  description: string | null;
  is_watermark: boolean;
  is_new_player: boolean;
  attach_type: string | null;
}

/** Разобранное содержимое поля comment.files (результат JSON.parse) */
export interface WebhookCommentFiles {
  files: WebhookCommentFile[];
}

/** Комментарий к ответу в теле вебхука */
interface WebhookComment {
  id: string;
  answer_id: number;
  user_id: number;
  owner_id: number;
  owner_type_id: number;
  comment_text: string;
  created_at: string;
  /** JSON-строка вида {"files":[...]}. Разбирается через JSON.parse в WebhookCommentFiles */
  files: string;
  lesson_data: WebhookCommentLessonData;
}

/** Добавлен комментарий к ответу */
export interface AnswerCommentCreatedWebhook extends WebhookEventBase {
  eventType: 'getcourse/answerCommentCreated';
  comment: WebhookComment;
}
