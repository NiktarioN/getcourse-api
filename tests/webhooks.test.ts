import { describe, it } from 'vitest';
import gc from './helpers/client.ts';
import expectTrue from './helpers/expect-ok.ts';

const uri = process.env.TEST_WEBHOOK_URI ?? '';

describe('webhooks', () => {
  describe('Входящие сообщения (1)', () => {
    it.skipIf(!uri)('Новый диалог (1,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 1, event_id: 1 })),
    );

    it.skipIf(!uri)('Переоткрыт диалог (1,2)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 1, event_id: 2 })),
    );

    it.skipIf(!uri)('Новое сообщение (1,3)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 1, event_id: 3 })),
    );
  });

  describe('Заказы (2)', () => {
    it.skipIf(!uri)('Заказ создан (2,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 2, event_id: 1 })),
    );

    it.skipIf(!uri)('Смена статуса (2,2)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 2, event_id: 2 })),
    );

    it.skipIf(!uri)('Заказ оплачен (2,3)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 2, event_id: 3 })),
    );
  });

  describe('Комментарии к урокам (4)', () => {
    it.skipIf(!uri)('Добавлен ответ на урок (4,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 4, event_id: 1 })),
    );
  });

  describe('Комментарии к ответам (5)', () => {
    it.skipIf(!uri)('Добавлен комментарий к ответу (5,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 5, event_id: 1 })),
    );
  });

  describe('Комментарии вебинаров (7)', () => {
    it.skipIf(!uri)('Новый комментарий на вебинаре (7,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 7, event_id: 1 })),
    );
  });

  describe('Звонки (8)', () => {
    it.skipIf(!uri)('Новый звонок (8,1)', async () =>
      expectTrue(gc.setUri({ uri, event_object_id: 8, event_id: 1 })),
    );
  });
});
