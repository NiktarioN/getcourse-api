import type { LessonAnswerStatus } from '../models/lesson.ts';

/** Добавить комментарий к ответу на урок */
export interface AddLessonAnswerCommentRequest {
  /** ID ответа на урок */
  lessonAnswerId: number;
  /** Текст комментария */
  text: string;
  /** ID пользователя */
  userId: number;
}

/** Изменить статус ответа на урок */
export interface ChangeLessonAnswerStatusRequest {
  /** ID ответа на урок */
  lessonAnswerId: number;
  /**
   * Статус задания/комментария.
   * Для комментария: new, accepted, viewed.
   * Для задания: new, accepted, declined.
   */
  status: LessonAnswerStatus;
}
