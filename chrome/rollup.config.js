import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const plugins = [
  resolve(),
  commonjs({
    extensions: ['.js'], // Removed '.ts' unless necessary
  }),
  typescript({
    compilerOptions: {
      target: 'es6',
      module: 'ES2022', // Adjusted to 'ES2022' for consistency
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      lib: ['dom', 'ES2022'],
    },
  }),
  production && terser(),
];

export default [
  {
    input: './src/contentPage.ts',
    output: {
      file: '../angular/dist/contentPage.js',
      format: 'iife',
      sourcemap: !production,
    },
    plugins,
  },
  {
    input: './src/serviceWorker.ts',
    output: {
      file: '../angular/dist/serviceWorker.js',
      format: 'iife',
      sourcemap: !production,
    },
    plugins,
  },
];
