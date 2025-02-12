import { withNx } from '@nx/rollup/with-nx.js';
import { defineConfig } from 'rollup';
import alias from '@rollup/plugin-alias';

const nx = withNx({
  main: './src/index.ts',
  outputPath: './dist',
  tsConfig: './tsconfig.lib.json',
  compiler: 'swc',
  format: ['esm'],
  sourceMap: true,
});

export default defineConfig({
  ...nx,
  plugins: [
    ...(Array.isArray(nx.plugins) ? nx.plugins : []),
    alias({
      entries: [
        { find: '@commander-js/extra-typings', replacement: 'commander' },
      ],
    }),
  ],
});
