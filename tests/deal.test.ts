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
    expect((await gc.getDealCancelReasons()).status).toBe(true);
  });

  it('getDealsTags', async () => {
    expect((await gc.getDealsTags()).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealFields', async () => {
    expect((await gc.getDealFields(dealId)).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealCustomFields', async () => {
    expect((await gc.getDealCustomFields(dealId)).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealComments', async () => {
    expect((await gc.getDealComments(dealId)).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('getDealCalls', async () => {
    expect((await gc.getDealCalls(dealId)).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId))('updateDealFields', async () => {
    expect((await gc.updateDealFields({ dealId })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(offerId))('addDealPositions', async () => {
    expect((await gc.addDealPositions({ dealId, positions: [{ offerId }] })).status).toBe(true);
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(dealPositionId))(
    'removeDealPositions',
    async () => {
      expect((await gc.removeDealPositions({ dealId, positionIds: [dealPositionId] })).status).toBe(
        true,
      );
    },
  );

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(userId))('addCommentToDeal', async () => {
    expect(
      (
        await gc.addCommentToDeal({
          dealId,
          userId: adminUserId,
          text: 'Тестовый комментарий',
        })
      ).status,
    ).toBe(true);
  });
});
