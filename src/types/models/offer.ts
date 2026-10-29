import type { Training } from './training.ts';
import type { CurrencyType } from '../dictionaries.ts';

/** Тип продукта */
export type OfferProductType =
  | 'simple' // Продукт без доступа
  | 'training' // Доступ к тренингу
  | 'groups' // Вхождение в группу
  | 'promo_code' // Промокод
  | 'user_balance' // Зачисление средств на депозит
  | 'virtual_balance' // Пополнение бонусного счета
  | 'cms_template' // Шаблон лендинга
  | 'ticket'; // Билет

/**
 * Ставка НДС предложения
 *
 * У предложений, созданных до смены ставок, могут встречаться значения,
 * которых в форме уже нет, например `vat18`, `vat20`
 */
export type OfferVat = '' | 'none' | 'vat0' | 'vat5' | 'vat7' | 'vat10' | 'vat22';

/** Поток тренинга, к которому привязан продукт */
export interface OfferProductStream {
  id: number;
  stream_id: number;
  start_at: string | null;
  finish_at: string;
}

/** Продукт в составе предложения */
export interface OfferProduct {
  id: number;
  type: OfferProductType;
  training: Pick<Training, 'id' | 'title'> | null;
  stream: OfferProductStream | null;
}

/** Предложение */
export interface Offer {
  id: number;
  title: string;
  code: string | null;
  price: number;
  discount_value: number;
  final_price: number;
  currency: CurrencyType;
  status: string;
  /** Настройки предложения JSON-строкой */
  params: string | null;
  products: OfferProduct[];
  after_payment_redirect_url: string | null;
  vat: OfferVat | null;
  tags: Record<string, string> | [];
}

/** Имена тегов оффера */
export interface OfferTagNames {
  offerId: number;
  tags: string[];
}
