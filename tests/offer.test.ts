import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const offerId = envNum(process.env.TEST_OFFER_ID);

describe('offer', () => {
  it('getOffers', async () => {
    expect((await gc.getOffers()).status).toBe(true);
  });

  it('getOffersTags', async () => {
    expect((await gc.getOffersTags()).status).toBe(true);
  });

  it.skipIf(Number.isNaN(offerId))('getOfferById', async () => {
    expect((await gc.getOfferById(offerId)).status).toBe(true);
  });
});
