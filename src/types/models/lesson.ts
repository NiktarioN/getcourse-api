/** Дополнительное поле ответа на урок */
export interface LessonAnswerAdditionalField {
  id: number;
  title: string;
  type: string;
  required: string | boolean;
  hidden: boolean;
  value: string | string[] | { text: string; hash: string } | null;
}

/** Комментарий к ответу на урок */
export interface LessonAnswerComment {
  id: number;
  comment_text: string;
  user_id: number;
  files: string | string[];
  created_at: string;
}

/** Статус ответа на урок */
export type LessonAnswerStatus = 'new' | 'declined' | 'accepted' | 'viewed';

/** Тип ответа на урок */
export type LessonAnswerType = 'mission_answer' | 'free_comment' | 'mission_answer_no_check';

/** Ответ на урок */
export interface LessonAnswer {
  id: number;
  lesson_id: number;
  lesson_name: string;
  answer_text: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  status: LessonAnswerStatus;
  type: LessonAnswerType;
  reviewer_user_id: number;
  reviewed_at: string | null;
  review_text?: string | null;
  review_file?: string | null;
  training_id: number;
  training_name: string;
  need_teacher_reaction: 1 | 0;
  need_teacher_reaction_at: string;
  response_teacher_id: number | null;
  comments: LessonAnswerComment[];
  additional_fields: LessonAnswerAdditionalField[];
}
