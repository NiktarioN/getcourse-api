import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import expectTrue from '../helpers/expect-true.ts';

describe('school', () => {
  it('getAllGroups', async () => {
    await expectTrue(gc.getAllGroups());
  });

  it('getAllPersonalManagers', async () => {
    await expectTrue(gc.getAllPersonalManagers());
  });

  it('getTrainings', async () => {
    await expectTrue(gc.getTrainings());
  });
});
