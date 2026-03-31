import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: 'src/main.ts' },
  format: ['esm', 'cjs'],
  outDir: '.dist',
  sourcemap: false,
  dts: { build: true },
  clean: true,
  platform: 'neutral',
  target: 'es2024',
});
