import { resolve } from 'node:path';
import { build as esbuild } from 'esbuild';
import { nodeExternals as pluginNodeExternals } from 'esbuild-plugin-node-externals';

const cwd = process.cwd();

await esbuild({
  bundle: true,
  platform: 'node',
  target: `node${process.versions.node}`,
  format: 'esm',
  plugins: [pluginNodeExternals()],
  entryPoints: [resolve(cwd, 'src/main.ts')],
  outfile: resolve(cwd, '.dist/index.js'),
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
