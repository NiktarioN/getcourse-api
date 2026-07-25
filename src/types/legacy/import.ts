import type { DateOnly, DateTime, LegacyDealStatus, LegacyPaymentStatus } from './common.ts';
import type { CurrencyType, PaymentType } from '../dictionaries.ts';

/** Данные пользователя */
export interface LegacyUserParams {
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  country?: string;
  group_name?: (string | [string, DateOnly | DateTime])[];
  addfields?: Record<string, string>;
}

/** Системные параметры */
export interface LegacySystemParams {
  refresh_if_exists?: 1 | 0;
  partner_email?: string;
  multiple_offers?: 1 | 0;
  return_payment_link?: 1 | 0;
  return_deal_number?: 1 | 0;
}

/** Параметры сессии/UTM */
export interface LegacySessionParams {
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_campaign?: string;
  utm_group?: string;
  gcpc?: string;
  gcao?: string;
  referer?: string;
}

/** Запрос на создание/обновление пользователя */
export interface AddUserRequest {
  user: LegacyUserParams;
  system?: LegacySystemParams;
  session?: LegacySessionParams;
}

/** Базовые параметры сделки */
interface BaseDealParams {
  deal_number?: string;
  offer_code?: string;
  offer_id?: string;
  product_title?: string;
  product_description?: string;
  quantity?: number;
  deal_cost?: string;
  deal_status?: LegacyDealStatus;
  deal_is_paid?: 1 | 0;
  manager_email?: string;
  deal_created_at?: DateTime;
  deal_finished_at?: DateTime;
  deal_comment?: string;
  payment_type?: PaymentType;
  payment_status?: LegacyPaymentStatus;
  partner_email?: string;
  addfields?: Record<string, string>;
  deal_currency?: CurrencyType;
  funnel_id?: string;
  funnel_stage_id?: string;
}

/** Создание сделки по уникальному коду предложения */
interface DealByOfferCode extends BaseDealParams {
  offer_code: string;
  deal_cost: string;
}

/** Создание сделки по ID предложения */
interface DealByOfferId extends BaseDealParams {
  offer_id: string;
}

/** Параметры сделки (offer_code + deal_cost ИЛИ offer_id обязательны) */
export type LegacyDealParams = DealByOfferCode | DealByOfferId;

/** Запрос на создание сделки */
export interface CreateDealRequest {
  user: LegacyUserParams;
  deal: LegacyDealParams;
  system?: LegacySystemParams;
  session?: LegacySessionParams;
}

/** Результат добавления пользователя */
export interface AddUserResult {
  user_id: number;
  success: boolean | string;
  error: boolean | string;
  error_message: string;
}

/** Результат создания сделки */
export interface CreateDealResult {
  deal_id: number;
  deal_number: string;
  success: boolean | string;
  user_id: number;
  error: boolean | string;
  error_message: string;
}
