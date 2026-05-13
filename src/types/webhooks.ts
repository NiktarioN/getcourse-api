/**
 * Типы вебхуков GetCourse API
 */

/** Объекты событий */
export interface EventObjectId {
  /** Входящие сообщения */
  Dialog: 1;
  /** Заказы */
  Deal: 2;
  /** Комментарии к урокам */
  LessonComment: 4;
  /** Комментарии к ответам */
  AnswerComment: 5;
  /** Комментарии вебинаров */
  WebinarComment: 7;
  /** Звонки */
  Call: 8;
}

/** ID событий для Входящих сообщений (event_object_id = 1) */
export interface DialogEventId {
  /** Создан новый диалог по сообщению ученика */
  NewDialog: 1;
  /** Переоткрыт закрытый диалог по сообщению ученика */
  DialogReopened: 2;
  /** Новое сообщение в диалоге от ученика */
  NewMessage: 3;
}

/** ID событий для Заказов (event_object_id = 2) */
export interface DealEventId {
  /** Создан новый заказ */
  DealCreated: 1;
  /** Смена статуса заказа */
  DealStatusChanged: 2;
  /** Заказ оплачен */
  DealPaid: 3;
}

/** ID событий для Комментариев к урокам (event_object_id = 4) */
export interface LessonCommentEventId {
  /** Добавлен ответ на урок */
  AnswerAdded: 1;
}

/** ID событий для Комментариев к ответам (event_object_id = 5) */
export interface AnswerCommentEventId {
  /** Добавлен комментарий к ответу */
  CommentAdded: 1;
}

/** ID событий для Комментариев вебинаров (event_object_id = 7) */
export interface WebinarCommentEventId {
  /** Получение новых комментариев от зрителей */
  NewComment: 1;
}

/** ID событий для Звонков (event_object_id = 8) */
export interface CallEventId {
  /** Получение нового звонка */
  NewCall: 1;
}

// ─── Конкретные типы для setUri ────────────────────────────────────────────────

export interface BaseSetUriRequest {
  /** URI для отправки события */
  uri: string;
}

/** Установить URI для события: Создан новый диалог */
export interface SetUriNewDialogRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 1;
}

/** Установить URI для события: Переоткрыт диалог */
export interface SetUriDialogReopenedRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 2;
}

/** Установить URI для события: Новое сообщение в диалоге */
export interface SetUriNewMessageRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 3;
}

/** Установить URI для события: Создан новый заказ */
export interface SetUriDealCreatedRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 1;
}

/** Установить URI для события: Смена статуса заказа */
export interface SetUriDealStatusChangedRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 2;
}

/** Установить URI для события: Заказ оплачен */
export interface SetUriDealPaidRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 3;
}

/** Установить URI для события: Новый звонок */
export interface SetUriNewCallRequest extends BaseSetUriRequest {
  event_object_id: 8;
  event_id: 1;
}

/** Все возможные запросы для метода setUri */
export type SetUriRequest =
  | SetUriNewDialogRequest
  | SetUriDialogReopenedRequest
  | SetUriNewMessageRequest
  | SetUriDealCreatedRequest
  | SetUriDealStatusChangedRequest
  | SetUriDealPaidRequest
  | SetUriNewCallRequest;

// ─── Payload-типы хуков ──────────────────────────────────────────────────────

/** Данные пользователя в хуке диалога */
export interface DialogEventUserData {
  id: number;
  name: string;
  email: string;
}

/** Данные отдела в хуке диалога */
export interface DialogEventDepartment {
  id: number;
  title: string;
}

/** Payload хука входящего диалога (event_object_id = 1) */
export interface DialogMessageEventPayload {
  message_id: number;
  dialog_id: number;
  event_id: number;
  message: string;
  created_at: string;
  transport: number | null;
  personal_manager_id: number | null;
  department: DialogEventDepartment;
  attached_files: { url: string }[] | null;
  user_data: DialogEventUserData;
}

/** Payload хука комментария к ответу (event_object_id = 5, event_id = 1) */
export interface AnswerCommentEventPayload {
  answer_id: number;
  comment_id: number;
  lesson_id: number;
  user_id: number;
  comment_text: string;
  created_at: string;
}
