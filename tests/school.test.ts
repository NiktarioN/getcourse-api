import { describe, expect, it } from 'vitest';
import gc from './helpers/client.ts';

describe('school', () => {
  it('getAllGroups', async () => {
    const result = await gc.getAllGroups();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it('getAllPersonalManagers', async () => {
    const result = await gc.getAllPersonalManagers();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });

  it('getTrainings', async () => {
    const result = await gc.getTrainings();

    globalThis.console.dir(result, { depth: null });
    expect(result.status).toBe(true);
  });
});
