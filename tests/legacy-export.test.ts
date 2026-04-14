import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';

const groupId = envNum(process.env.TEST_GROUP_ID);

describe('legacy export', () => {
  it('exportUsers', async () => {
    expect((await gc.exportUsers()).status).toBe(true);
  });

  it.skipIf(Number.isNaN(groupId))('exportGroupUsers', async () => {
    expect((await gc.exportGroupUsers(groupId)).status).toBe(true);
  });

  it('exportDeals', async () => {
    expect((await gc.exportDeals()).status).toBe(true);
  });

  it('exportPayments', async () => {
    expect((await gc.exportPayments()).status).toBe(true);
  });
});
