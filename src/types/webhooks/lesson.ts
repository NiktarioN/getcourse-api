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
