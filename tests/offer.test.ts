import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const offerId = envNum(process.env.TEST_OFFER_ID);

describe('offer', () => {
  it('getOffers', async () => {
    const result = await gc.getOffers();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it('getOffersTags', async () => {
    const result = await gc.getOffersTags();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it.skipIf(Number.isNaN(offerId))('getOfferById', async () => {
    const result = await gc.getOfferById(offerId);

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
