import type { CurrencyType } from '../dictionaries.ts';

/** Статус заказа */
export type DealStatus =
  | 'new'
  | 'in_work'
  | 'not_confirmed'
  | 'payment_waiting'
  | 'waiting_for_return'
  | 'part_payed'
  | 'payed'
  | 'cancelled'
  | 'false';

/** Позиция заказа */
export interface DealPosition {
  id: number;
  offer_id: number;
  updated_at: string;
  created_at: string;
  quantity: number;
  title: string;
  price: number;
  currency: CurrencyType;
  order_pos: number;
  user_product_id: number | null;
  source_price: number;
  start_at: string | null;
}

/** Заказ */
export interface Deal {
  id: number;
  account_id: number;
  user_id: number;
  updated_at: string;
  created_at: string;
  created_user_id: number;
  cost: number;
  currency: CurrencyType;
  status: DealStatus;
  is_payed: boolean;
  title: string;
  number: number;
  foreign_code: string;
  manager_user_id: number | null;
  partner_user_id: number | null;
  partner_code_id: number | null;
  payment_link: string;
  payed_value: number;
  earned_value: number;
  commission_value: number;
  payed_at: string | null;
  is_finished: boolean;
  finished_at: string | null;
  user_payed_money_value: number;
  created_by_session_id: number | null;
  client_deal_number: number;
  promo_code_id: number | null;
  cancel_reason_id: number | null;
  cancel_reason_comment: string | null;
  status_updated_at: string | null;
  to_deposit_money_value: number;
  created_by_visit_id: number | null;
  for_account_id: number | null;
  positions: DealPosition[];
}

/**
 * Заказ вместе с тегами
 *
 * Теги приходят только из `deal/get-fields` — в `user/get-deals` их нет
 */
export interface DealWithTags extends Deal {
  tags: DealTag[];
}

/** Тег заказа */
export interface DealTag {
  id: number;
  name: string;
}

/** Имена тегов заказа */
export interface DealTagNames {
  dealId: number;
  tags: string[];
}

/** Комментарий к заказу */
export interface DealComment {
  id: number;
  created_at: string;
  user_id: number;
  text: string;
}

/** Причина отмены заказа */
export interface DealCancelReason {
  id: number;
  name: string;
}
