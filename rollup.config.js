import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: pkg.main,
    output: {
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: pkg.main_rough,
    output: {
      file: pkg.browser_rough,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  }
];
