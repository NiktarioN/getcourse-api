import type { WebhookDialogBase } from './dialog.ts';

/** Создан новый тикет по сообщению клиента */
export interface HelpdeskTicketCreatedWebhook extends WebhookDialogBase {
  event_id: 1;
}

/** Новое сообщение от клиента */
export interface HelpdeskClientMessageWebhook extends WebhookDialogBase {
  event_id: 2;
}

/** Новое сообщение от сотрудника */
export interface HelpdeskEmployeeMessageWebhook extends WebhookDialogBase {
  event_id: 3;
}
