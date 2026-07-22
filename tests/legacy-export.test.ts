import { describe, it } from 'vitest';
import gc from './helpers/client.ts';
import { envNum } from './helpers/env.ts';
import expectTrue from './helpers/expect-true.ts';

const groupId = envNum(process.env.TEST_GROUP_ID);

describe('legacy export', () => {
  it('exportUsers', async () => {
    await expectTrue(gc.exportUsers());
  });

  it.skipIf(Number.isNaN(groupId))('exportGroupUsers', async () => {
    await expectTrue(gc.exportGroupUsers(groupId));
  });

  it('exportDeals', async () => {
    await expectTrue(gc.exportDeals());
  });

  it('exportPayments', async () => {
    await expectTrue(gc.exportPayments());
  });
});
