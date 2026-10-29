import { describe, expect, it } from 'vitest';

import gc from '../../helpers/client.ts';
import expectWebhookOk from '../../helpers/expect-webhook-ok.ts';

import type { WebhookListItem } from '../../../src/types/requests/webhook.ts';

const uri = process.env.TEST_WEBHOOK_URI ?? '';
const account = process.env.TEST_WEBHOOK_ACCOUNT ?? '';
/** Подписка, на которой проверяется отписка списком */
const testHook = { uri, event_object_id: 8, event_id: 1 } as const;

const isTestHook = (hook: WebhookListItem): boolean =>
  hook.account === account &&
  hook.uri === uri &&
  hook.event_object_id === testHook.event_object_id &&
  hook.event_id === testHook.event_id;

const isTestUriHook = (hook: WebhookListItem): boolean =>
  hook.account === account && hook.uri === uri;

describe('webhooks list', () => {
  it('getWebhooks', async () => expectWebhookOk(gc.getWebhooks()));

  it.skipIf(!uri || !account)('unsubscribeWebhooks', async () => {
    await gc.subscribeWebhook(testHook);

    try {
      const { hooks } = await gc.getWebhooks();
      const testHooks = hooks.filter(isTestHook);

      expect(testHooks.length).toBeGreaterThan(0);
      globalThis.console.log('Подписка активна:', testHooks);

      const result = await gc.unsubscribeWebhooks(testHooks);

      expect(result.unsubscribed.length).toBeGreaterThan(0);
      globalThis.console.log('Отписано:', result.unsubscribed);
      expect(result.hooks.some(isTestHook)).toBe(false);
    } finally {
      await gc.unsubscribeWebhook(testHook);
    }
  });

  it.skipIf(!uri || !account)('unsubscribeWebhooks: все подписки тестового uri', async () => {
    const { hooks } = await gc.getWebhooks();
    const result = await gc.unsubscribeWebhooks(hooks.filter(isTestUriHook));

    expect(result.hooks.some(isTestUriHook)).toBe(false);
    globalThis.console.log('Отписано от всех подписок тестового uri:', result.unsubscribed);
  });
});
