import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30_000,
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/legacy-export.test.ts', 'node_modules/**'],
  },
});
