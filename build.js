import Bun from 'bun';
import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/index.ts'],
  format: 'esm',
  minify: {
    identifiers: false,
    syntax: true,
    whitespace: true,
  },
  outdir: './dist',
  plugins: [dts()],
  root: './src',
  splitting: false,
  target: 'node',
});
