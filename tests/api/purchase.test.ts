import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const purchaseId = envNum(process.env.TEST_PURCHASE_ID);

describe('purchase', () => {
  it.skipIf(Number.isNaN(purchaseId))('updatePurchaseInfo', async () => {
    await expectTrue(
      gc.updatePurchaseInfo({ user_product_id: purchaseId, period_type: 'unlimited' }),
    );
  });
});
