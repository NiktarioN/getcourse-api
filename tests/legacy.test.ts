import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';

const addUserEmail = process.env.TEST_USER_EMAIL;
const offerId = process.env.TEST_OFFER_ID;

describe('legacy', () => {
  it('getCustomFields', async () => {
    expect((await gc.getCustomFields()).status).toBe(true);
  });

  it.skipIf(!addUserEmail)('addUser', async () => {
    expect(
      (
        await gc.addUser({
          user: { email: addUserEmail ?? '' },
          system: { refresh_if_exists: 1 },
        })
      ).status,
    ).toBe(true);
  });

  it.skipIf(!addUserEmail || !offerId)('createDeal', async () => {
    expect(
      (
        await gc.createDeal({
          user: { email: addUserEmail ?? '' },
          deal: { offer_id: offerId ?? '' },
        })
      ).status,
    ).toBe(true);
  });
});
