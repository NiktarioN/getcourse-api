import { describe, it } from 'vitest';

import gc from '../../helpers/client.ts';
import expectWebhookOk from '../../helpers/expect-webhook-ok.ts';

import type { WebhookSubscription } from '../../../src/types/requests/webhook.ts';

const uri = process.env.TEST_WEBHOOK_URI ?? '';

const subscriptions: { title: string; subscription: WebhookSubscription }[] = [
  { title: 'Новый диалог (1,1)', subscription: { uri, event_object_id: 1, event_id: 1 } },
  { title: 'Переоткрыт диалог (1,2)', subscription: { uri, event_object_id: 1, event_id: 2 } },
  { title: 'Сообщение от ученика (1,3)', subscription: { uri, event_object_id: 1, event_id: 3 } },
  {
    title: 'Сообщение от сотрудника (1,4)',
    subscription: { uri, event_object_id: 1, event_id: 4 },
  },
  { title: 'Заказ создан (2,1)', subscription: { uri, event_object_id: 2, event_id: 1 } },
  { title: 'Смена статуса (2,2)', subscription: { uri, event_object_id: 2, event_id: 2 } },
  { title: 'Заказ оплачен (2,3)', subscription: { uri, event_object_id: 2, event_id: 3 } },
  {
    title: 'Добавлен ответ на урок (4,1)',
    subscription: { uri, event_object_id: 4, event_id: 1 },
  },
  {
    title: 'Добавлен комментарий к ответу (5,1)',
    subscription: { uri, event_object_id: 5, event_id: 1 },
  },
  {
    title: 'Новый комментарий на вебинаре (7,1)',
    subscription: { uri, event_object_id: 7, event_id: 1 },
  },
  { title: 'Новый звонок (8,1)', subscription: { uri, event_object_id: 8, event_id: 1 } },
  { title: 'Новый тикет (9,1)', subscription: { uri, event_object_id: 9, event_id: 1 } },
  { title: 'Сообщение от клиента (9,2)', subscription: { uri, event_object_id: 9, event_id: 2 } },
  {
    title: 'Сообщение от сотрудника (9,3)',
    subscription: { uri, event_object_id: 9, event_id: 3 },
  },
];

describe('webhooks unsubscribe', () => {
  subscriptions.forEach(({ title, subscription }) => {
    it.skipIf(!uri)(title, async () => expectWebhookOk(gc.unsubscribeWebhook(subscription)));
  });
});
