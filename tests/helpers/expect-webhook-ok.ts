import { expect } from 'vitest';

import type { SubscribeWebhookResponse } from '../../src/types/requests/webhook.ts';

export default async function expectWebhookOk(
  request: Promise<SubscribeWebhookResponse>,
): Promise<void> {
  const result = await request;

  globalThis.console.dir(result, { depth: null });
  expect(result.success).toBe('OK');
}
