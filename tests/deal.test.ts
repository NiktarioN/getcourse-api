import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const adminUserId = envNum(process.env.TEST_ADMIN_USER_ID);
const dealId = envNum(process.env.TEST_DEAL_ID);
const userId = envNum(process.env.TEST_USER_ID);
const offerId = envNum(process.env.TEST_OFFER_ID);
const dealPositionId = envNum(process.env.TEST_DEAL_POSITION_ID);

describe('deal', () => {
  it('getDealCancelReasons', async () => {
    const result = await gc.getDealCancelReasons();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it('getDealsTags', async () => {
    const result = await gc.getDealsTags();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealFields', async () => {
    const result = await gc.getDealFields(dealId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealCustomFields', async () => {
    const result = await gc.getDealCustomFields(dealId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealComments', async () => {
    const result = await gc.getDealComments(dealId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealCalls', async () => {
    const result = await gc.getDealCalls(dealId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('updateDealFields', async () => {
    const result = await gc.updateDealFields({ dealId });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(offerId))('addDealPositions', async () => {
    const result = await gc.addDealPositions({ dealId, positions: [{ offerId }] });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(dealPositionId))(
    'removeDealPositions',
    async () => {
      const result = await gc.removeDealPositions({ dealId, positionIds: [dealPositionId] });

      globalThis.console.dir(result, { depth: null });
      expect(result.status).toBe(true);
    },
  );

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(userId))('addCommentToDeal', async () => {
    const result = await gc.addCommentToDeal({
      dealId,
      userId: adminUserId,
      text: 'Тестовый комментарий',
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('updateDealCustomFields', async () => {
    const result = await gc.updateDealCustomFields({
      dealId,
      customFields: {
        '1': 'Значение 1',
        '3': 34,
        '15': 'Значение 2',
      },
    });

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
