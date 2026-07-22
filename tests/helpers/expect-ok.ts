import { expect } from "vitest";

import type { ApiResponse } from "../../src/types/common.ts";

export default async function expectTrue<T>(
  request: Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> {
  const result = await request;

  globalThis.console.dir(result, { depth: null });
  expect(result.status).toBe(true);

  return result;
}
