import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import expectTrue from '../helpers/expect-true.ts';

const addUserEmail = process.env.TEST_USER_EMAIL;
const offerId = process.env.TEST_OFFER_ID;

describe('legacy', () => {
  it('getCustomFields', async () => {
    await expectTrue(gc.getCustomFields());
  });

  it.skipIf(!addUserEmail)('addUser', async () => {
    await expectTrue(
      gc.addUser({
        user: { email: addUserEmail ?? '' },
        system: { refresh_if_exists: 1 },
      }),
    );
  });

  it.skipIf(!addUserEmail || !offerId)('createDeal', async () => {
    await expectTrue(
      gc.createDeal({
        user: { email: addUserEmail ?? '' },
        deal: { offer_id: offerId ?? '' },
      }),
    );
  });
});
