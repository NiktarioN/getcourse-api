import { expect } from 'vitest';

import type { ApiResponse } from '../../src/types/common.ts';

export default async function expectTrue(request: Promise<ApiResponse<unknown>>): Promise<void> {
  const result = await request;

  globalThis.console.dir(result, { depth: null });
  expect(result.status).toBe(true);
}
