import { describe, it } from 'vitest';

import gc from '../helpers/client.ts';
import expectTrue from '../helpers/expect-true.ts';

describe('school', () => {
  it('getGroups', async () => {
    await expectTrue(gc.getGroups());
  });

  it('getPersonalManagers', async () => {
    await expectTrue(gc.getPersonalManagers());
  });

  it('getTrainings', async () => {
    await expectTrue(gc.getTrainings());
  });

  it('getDepartments', async () => {
    await expectTrue(gc.getDepartments());
  });
});
