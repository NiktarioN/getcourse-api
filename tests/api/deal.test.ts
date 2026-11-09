import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectResultTrue from '../helpers/expect-result-true.ts';
import expectTrue from '../helpers/expect-true.ts';

const adminUserId = envNum(process.env.TEST_ADMIN_USER_ID);
const dealId = envNum(process.env.TEST_DEAL_ID);
const userId = envNum(process.env.TEST_USER_ID);
const offerId = envNum(process.env.TEST_OFFER_ID);
const dealPositionId = envNum(process.env.TEST_DEAL_POSITION_ID);

describe('deal', () => {
  it('getDealCancelReasons', async () => {
    await expectTrue(gc.getDealCancelReasons());
  });

  it('getDealsWithTags', async () => {
    await expectTrue(gc.getDealsWithTags());
  });

  it.skipIf(Number.isNaN(dealId))('getDealInfo', async () => {
    await expectTrue(gc.getDealInfo(dealId));
  });

  it.skipIf(Number.isNaN(dealId))('getDealCustomFields', async () => {
    await expectTrue(gc.getDealCustomFields(dealId));
  });

  it.skipIf(Number.isNaN(dealId))('getDealComments', async () => {
    await expectTrue(gc.getDealComments(dealId));
  });

  it.skipIf(Number.isNaN(dealId))('getDealCalls', async () => {
    await expectTrue(gc.getDealCalls(dealId));
  });

  it.skipIf(Number.isNaN(dealId))('updateDealInfo: статус', async () => {
    await expectTrue(gc.updateDealInfo({ dealId, status: 'in_work' }));
  });

  it.skipIf(Number.isNaN(dealId))('updateDealInfo: отмена с причиной', async () => {
    const { data: reasons } = await gc.getDealCancelReasons();

    await expectTrue(
      gc.updateDealInfo({
        dealId,
        status: 'cancelled',
        cancel_reason_id: reasons[0].id,
        cancel_reason_comment: 'Тест API',
      }),
    );
  });

  it.skipIf(Number.isNaN(dealId))('updateDealInfo: менеджер', async () => {
    const { data: managers } = await gc.getManagers();

    await expectTrue(gc.updateDealInfo({ dealId, manager_user_id: managers[0].id }));
  });

  it.skipIf(Number.isNaN(dealId))('updateDealInfo: теги', async () => {
    await expectTrue(gc.updateDealInfo({ dealId, tags: ['тех_ТЕСТЫ-НАСТРОЕК'] }));
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(offerId))('addDealPositions', async () => {
    await expectTrue(gc.addDealPositions({ dealId, positions: [{ offerId }] }));
  });

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(dealPositionId))(
    'removeDealPositions',
    async () => {
      await expectTrue(gc.removeDealPositions({ dealId, positionIds: [dealPositionId] }));
    },
  );

  it.skipIf(Number.isNaN(dealId) || Number.isNaN(userId))('addDealComment', async () => {
    await expectResultTrue(
      gc.addDealComment({
        dealId,
        userId: adminUserId,
        text: 'Тестовый комментарий',
      }),
    );
  });

  it.skipIf(Number.isNaN(dealId))('updateDealCustomFields', async () => {
    await expectTrue(
      gc.updateDealCustomFields({
        dealId,
        customFields: {
          '1': 'Значение 1',
          '3': 34,
          '15': 'Значение 2',
        },
      }),
    );
  });
});
