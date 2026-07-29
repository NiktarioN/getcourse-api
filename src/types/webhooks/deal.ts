import type { WebhookEventBase } from './base.ts';
import type { CurrencyType } from '../dictionaries.ts';
import type { DealStatus } from '../models/deal.ts';

/** Заказ в теле вебхука */
interface WebhookDeal {
  /** ID заказа. Приходит строкой, хотя значение числовое */
  id: string;
  cost: number;
  number: number;
  status: DealStatus;
  /** Флаг оплаты. Приходит то числом (0/1), то boolean (true/false) */
  isPayed: number | boolean;
  currency: CurrencyType;
  offerIds: number[];
  createdAt: string;
  payedValue: number;
  /** Клиентский номер заказа. Приходит то строкой ("0"), то числом */
  clientDealNumber: string | number;
}

/** Пользователь в теле вебхука заказа */
interface WebhookUser {
  /** Составной ID вида "<accountId>:<userId>" */
  id: string;
  /** Внешний идентификатор клиента, обычно null */
  cuid: string | null;
  gcId: number;
  /** Тип пользователя, например "Real" */
  type: string;
  email: string;
}

/** Общий блок для событий заказа */
interface WebhookDealEventBase extends WebhookEventBase {
  deal: WebhookDeal;
  user: WebhookUser;
  gcSessionId: number | null;
  gcVisitorId: number | null;
}

/** Заказ создан */
export interface DealCreatedWebhook extends WebhookDealEventBase {
  eventType: 'getcourse/dealCreated';
}

/** Заказ оплачен */
export interface DealPaidWebhook extends WebhookDealEventBase {
  eventType: 'getcourse/dealPaid';
}

/** Смена статуса заказа */
export interface DealStatusChangedWebhook extends WebhookDealEventBase {
  eventType: 'getcourse/dealStatusChanged';
}
