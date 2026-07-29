import type { UserIdentifier } from '../common.ts';

/** Тип баланса */
export type BalanceType = 'normal' | 'virtual' | 'points';

/** Добавить комментарий к пользователю */
export interface AddUserCommentRequest extends UserIdentifier {
  /** ID автора комментария */
  authorId: number;
  /** Текст комментария */
  text: string;
}

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
  /** Отправлять уведомление о выдаче диплома (по умолчанию: true) */
  sendNotify?: boolean;
}

/** Получить баланс пользователя */
export interface GetUserBalanceRequest extends UserIdentifier {
  /** Тип баланса */
  type?: BalanceType;
}

/** Получить покупки пользователя */
export interface GetUserPurchasesRequest extends UserIdentifier {
  /** ID продукта */
  productId?: number;
}
