import _minifyHTML from 'rollup-plugin-minify-html-literals';
import _summary from 'rollup-plugin-summary';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import litcss from 'rollup-plugin-lit-css';
import resolve from '@rollup/plugin-node-resolve';
import yaml from '@rollup/plugin-yaml';
import { copy } from '@web/rollup-plugin-copy';
import { defineConfig } from 'rollup';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';

const minifyHTML = _minifyHTML.default;
const summary    = _summary.default;

export default defineConfig({
  output: {
    dir: 'dist'
  },

  plugins: [
    html({
      input: 'demo/index.html'
    }),

    esbuild({
      minify: true
    }),

    resolve(),
    commonjs(),
    litcss(),
    yaml(),
    minifyHTML(),

    copy({
      patterns: '_headers'
    }),

    summary()
  ]
});
