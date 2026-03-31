/**
 * Request-типы для POST эндпоинтов
 * Соответствуют компонентам schemas в OpenAPI схеме
 */

import type { UserIdentifier } from './common.ts';
import type { DealStatus, LessonAnswerStatus } from './models.ts';

// ─── Deal ──────────────────────────────────────────────────────────────────────

/** Добавить комментарий к заказу */
export interface AddCommentToDealRequest {
  /** ID заказа */
  dealId: number;
  /** ID пользователя */
  userId: number;
  /** Текст комментария */
  text: string;
}

/** Позиция для добавления в заказ */
export interface DealPositionInput {
  /** ID оффера */
  offerId: number;
  /** Цена позиции */
  price?: number;
  /** Количество */
  quantity?: number;
}

/** Добавить позиции в заказ */
export interface AddDealPositionsRequest {
  /** ID заказа */
  dealId: number;
  /** Позиции для добавления */
  positions: DealPositionInput[];
}

/** Удалить позиции из заказа */
export interface RemoveDealPositionsRequest {
  /** ID заказа */
  dealId: number;
  /** ID позиций для удаления */
  positionIds: number[];
}

/** Обновить поля заказа */
export interface UpdateDealFieldsRequest {
  /** ID заказа */
  dealId: number;
  /** ID менеджера */
  manager_user_id?: number;
  /** Статус заказа */
  status?: DealStatus;
  /** Комментарий к причине отмены */
  cancel_reason_comment?: string;
  /** Теги */
  tags?: string[];
}

// ─── Dialog ────────────────────────────────────────────────────────────────────

/**
 * Транспорт для отправки комментария к диалогу:
 * 0 - Сайт, 1 - Email, 2 - SMS, 3 - Telegram, 4 - Facebook,
 * 5 - VK, 6 - Chatium, 7 - Whatsapp, 8 - Viber, 9 - Line
 */
export type DialogTransport = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Добавить комментарий в диалог */
export interface AddCommentToDialogRequest {
  /** ID диалога */
  dialogId: number;
  /** Текст комментария */
  commentText: string;
  /** Транспорты для отправки */
  transport: DialogTransport[];
  /** ID сотрудника/администратора */
  userId: number;
}

/** Изменить отдел диалога */
export interface ChangeDepartmentRequest {
  /** ID диалога */
  dialogId: number;
  /** ID нового отдела */
  newDepartmentId: number;
}

/** Закрыть диалог */
export interface CloseDialogRequest {
  /** ID диалога */
  dialogId: number;
}

/** Получить историю диалога */
export interface GetDialogHistoryRequest {
  /** ID диалога */
  dialogId: number;
  /** Количество сообщений (не более 1000, по умолчанию: 100) */
  limit?: number;
}

// ─── Lesson ────────────────────────────────────────────────────────────────────

/** Добавить комментарий к ответу на урок */
export interface AddCommentToLessonAnswerRequest {
  /** ID ответа на урок */
  lessonAnswerId: number;
  /** Текст комментария */
  text: string;
  /** ID пользователя */
  userId: number;
}

/** Изменить статус ответа на урок */
export interface ChangeStatusAnswersRequest {
  /** ID ответа на урок */
  lessonAnswerId: number;
  /**
   * Статус задания/комментария.
   * Для комментария: new, accepted, viewed.
   * Для задания: new, accepted, declined.
   */
  status: LessonAnswerStatus;
}

// ─── Note ──────────────────────────────────────────────────────────────────────

/** Добавить заметку к диалогу */
export interface AddNoteRequest {
  /** ID диалога */
  dialogId: number;
  /** Текст заметки */
  text: string;
}

// ─── User ──────────────────────────────────────────────────────────────────────

/** Тип баланса */
export type BalanceType = 'virtual' | 'points';

/** Добавить баланс пользователю */
export interface AddUserBalanceRequest extends UserIdentifier {
  /** Количество */
  value: number;
  /** Тип баланса */
  type: BalanceType;
  /** Комментарий */
  comment: string;
}

/** Добавить пользователя в группы */
export interface AddUserGroupsRequest extends UserIdentifier {
  /** ID групп */
  groups: number[];
}

/** Удалить пользователя из групп */
export interface RemoveUserGroupsRequest extends UserIdentifier {
  /** ID групп */
  groups: number[];
}

/** Установить группы пользователя (заменяет текущие) */
export interface SetUserGroupsRequest extends UserIdentifier {
  /** ID групп */
  groups: number[];
}

/** Установить персонального менеджера */
export interface SetPersonalManagerRequest extends UserIdentifier {
  /** ID менеджера (передать пустым или не передавать для удаления) */
  managerId?: number;
}

/** Обновить кастомные поля пользователя */
export interface UpdateUserCustomFieldsRequest extends UserIdentifier {
  /** Поля в формате { "id_поля": "значение" } */
  customFields: Record<string, string | number>;
}

/** Пол пользователя */
export type UserGender = 'male' | 'female';

/** Обновить поля пользователя */
export interface UpdateUserFieldsRequest extends UserIdentifier {
  gender?: UserGender | null;
  country?: string | null;
  city?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  /** Формат: YYYY-MM-DD */
  birthday?: string | null;
  comment?: string | null;
  phone?: string | null;
}

/** Создать диплом пользователю */
export interface CreateDiplomaRequest extends UserIdentifier {
  /** ID шаблона диплома */
  templateId: number;
  /** Номер диплома (если не передавать — берётся следующий) */
  number?: string;
  /** Название тренинга (если не передавать — берётся из тренинга) */
  trainingName?: string;
  /** Имя пользователя (если не передавать — берётся из профиля) */
  userName?: string;
  /** Разрешать дубликаты (по умолчанию: false) */
  allowDuplicates?: boolean;
}

// ─── Webinar ───────────────────────────────────────────────────────────────────

/** Получить вебинары по ID */
export interface GetWebinarsByIdsRequest {
  /** Массив ID вебинаров */
  ids: number[];
}
