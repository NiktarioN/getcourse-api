import type { WebhookEventBase } from './base.ts';
import type { LessonAnswerStatus, LessonAnswerType } from '../models/lesson.ts';

/** Статистика теста (когда урок содержит опросник) */
interface WebhookQuestionary {
  /** Статус прохождения теста, в моих данных встречается "complete", возможно есть другие статусы */
  status: string;
  points_sum: number;
  answers_count: number;
  questions_count: number;
  right_answers_count: number;
}

/** Тип поля формы урока: фиксированные значения либо цель goal_<id> */
type WebhookFieldType = 'string' | 'text' | 'checkbox' | 'file' | 'file_list' | `goal_${number}`;

/** Дополнительное поле формы урока */
interface WebhookAdditionalField {
  id: number;
  title: string;
  type: WebhookFieldType;
  /** Флаг обязательности. Приходит то boolean, то строкой "1" */
  required: boolean | string;
  hidden: boolean;
  /** Значение поля. Объект { _useHardDelete } — служебный маркер GetCourse */
  value: string | number | { _useHardDelete: boolean } | null;
}

/** Ответ на урок в теле вебхука */
interface WebhookAnswer {
  /** ID ответа. ВНИМАНИЕ: приходит с одинарными кавычками внутри строки — "'500556948'" */
  id: string;
  user_id: number;
  text: string;
  status: LessonAnswerStatus;
  type: LessonAnswerType;
  created_at: string;
  /** Флаг удаления, число (0/1) */
  deleted: number;
  deleted_at: string | null;
  lesson_id: number;
  lesson_name: string;
  lesson_teacher_id: number | null;
  training_id: number;
  training_name: string;
  additional_fields: WebhookAdditionalField[];
  /** Объект статистики теста либо пустой массив, если теста нет */
  questionary: WebhookQuestionary | [];
}

/** Добавлен ответ на урок */
export interface LessonAnswerCreatedWebhook extends WebhookEventBase {
  eventType: 'getcourse/lessonAnswerCreated';
  answer: WebhookAnswer;
}

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
