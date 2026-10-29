import { describe, expect, it } from 'vitest';

import gc from '../helpers/client.ts';
import envNum from '../helpers/env.ts';
import expectTrue from '../helpers/expect-true.ts';

const offerId = envNum(process.env.TEST_OFFER_ID);

describe('offer', () => {
  it('getOffers', async () => {
    await expectTrue(gc.getOffers());
  });

  it('getOffers: с limit', async () => {
    const response = await gc.getOffers({ limit: 5 });

    globalThis.console.dir(response, { depth: null });
    expect(response.status).toBe(true);
    expect(response.data.length).toBeLessThanOrEqual(5);
  });

  it('getOffersWithTags', async () => {
    await expectTrue(gc.getOffersWithTags());
  });

  it.skipIf(Number.isNaN(offerId))('getOfferById', async () => {
    await expectTrue(gc.getOfferById(offerId));
  });
});
