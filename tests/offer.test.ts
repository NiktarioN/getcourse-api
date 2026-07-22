import { describe, it } from 'vitest';

import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';
import expectTrue from './helpers/expect-true.ts';

const offerId = envNum(process.env.TEST_OFFER_ID);

describe('offer', () => {
  it('getOffers', async () => {
    await expectTrue(gc.getOffers());
  });

  it('getOffersTags', async () => {
    await expectTrue(gc.getOffersTags());
  });

  it.skipIf(Number.isNaN(offerId))('getOfferById', async () => {
    await expectTrue(gc.getOfferById(offerId));
  });
});
