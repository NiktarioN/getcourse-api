/** Общие поля события вебхука */
export interface WebhookEventBase {
  /** Время события, ISO 8601 */
  ts: string;
  /** Время события, Unix-таймстамп в секундах (дублирует ts) */
  ts64: number;
  /** ID аккаунта GetCourse */
  gcAccountId: number;
}
