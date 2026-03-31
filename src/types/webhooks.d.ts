/**
 * Типы вебхуков GetCourse API
 */

/** Объекты событий */
interface EventObjectId {
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
}

/** ID событий для Входящих сообщений (event_object_id = 1) */
interface DialogEventId {
  /** Создан новый диалог по сообщению ученика */
  NewDialog: 1;
  /** Переоткрыт закрытый диалог по сообщению ученика */
  DialogReopened: 2;
  /** Новое сообщение в диалоге от ученика */
  NewMessage: 3;
}

/** ID событий для Заказов (event_object_id = 2) */
interface DealEventId {
  /** Создан новый заказ */
  DealCreated: 1;
  /** Смена статуса заказа */
  DealStatusChanged: 2;
  /** Заказ оплачен */
  DealPaid: 3;
}

/** ID событий для Комментариев к урокам (event_object_id = 4) */
interface LessonCommentEventId {
  /** Добавлен ответ на урок */
  AnswerAdded: 1;
}

/** ID событий для Комментариев к ответам (event_object_id = 5) */
interface AnswerCommentEventId {
  /** Добавлен комментарий к ответу */
  CommentAdded: 1;
}

/** ID событий для Комментариев вебинаров (event_object_id = 7) */
interface WebinarCommentEventId {
  /** Получение новых комментариев от зрителей */
  NewComment: 1;
}

// ─── Конкретные типы для setUri ────────────────────────────────────────────────

interface BaseSetUriRequest {
  /** URI для отправки события */
  uri: string;
}

/** Установить URI для события: Создан новый диалог */
interface SetUriNewDialogRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 1;
}

/** Установить URI для события: Переоткрыт диалог */
interface SetUriDialogReopenedRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 2;
}

/** Установить URI для события: Новое сообщение в диалоге */
interface SetUriNewMessageRequest extends BaseSetUriRequest {
  event_object_id: 1;
  event_id: 3;
}

/** Установить URI для события: Создан новый заказ */
interface SetUriDealCreatedRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 1;
}

/** Установить URI для события: Смена статуса заказа */
interface SetUriDealStatusChangedRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 2;
}

/** Установить URI для события: Заказ оплачен */
interface SetUriDealPaidRequest extends BaseSetUriRequest {
  event_object_id: 2;
  event_id: 3;
}

/** Все возможные запросы для метода setUri */
type SetUriRequest =
  | SetUriNewDialogRequest
  | SetUriDialogReopenedRequest
  | SetUriNewMessageRequest
  | SetUriDealCreatedRequest
  | SetUriDealStatusChangedRequest
  | SetUriDealPaidRequest;
