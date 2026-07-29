import type { CurrencyType } from '../dictionaries.ts';

/** Предложение */
export interface Offer {
  id: number;
  title: string;
  code: string;
  price: number;
  discount_value: number;
  final_price: number;
  currency: CurrencyType;
  status: string;
  params: Record<string, unknown>;
}

/** Тег оффера */
export interface OfferTag {
  offerId: number;
  tags: string[];
}
