import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';

describe('school', () => {
  it('getAllGroups', async () => {
    expect((await gc.getAllGroups()).status).toBe(true);
  });

  it('getAllPersonalManagers', async () => {
    expect((await gc.getAllPersonalManagers()).status).toBe(true);
  });

  it('getTrainings', async () => {
    expect((await gc.getTrainings()).status).toBe(true);
  });
});
