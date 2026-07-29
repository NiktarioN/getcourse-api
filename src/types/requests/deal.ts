import type { DealStatus } from '../models/deal.ts';

/** Добавить комментарий к заказу */
export interface AddDealCommentRequest {
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

/** Обновить доп. поля заказа */
export interface UpdateDealCustomFieldsRequest {
  /** ID заказа */
  dealId: number;
  /** Поля в формате { "id_поля": "значение" } */
  customFields: Record<string, string | number>;
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
