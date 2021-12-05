import esbuild from 'rollup-plugin-esbuild';
import html from '@web/rollup-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import yaml from '@rollup/plugin-yaml';
import { copy } from '@web/rollup-plugin-copy';

export default {
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

    yaml(),
    resolve(),
    minifyHTML(),

    copy({
      patterns: '_headers'
    }),

    summary()
  ]
};
