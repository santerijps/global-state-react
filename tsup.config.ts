import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/helpers.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
