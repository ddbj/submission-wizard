import esbuild from 'rollup-plugin-esbuild';
import html from '@web/rollup-plugin-html';
import litcss from 'rollup-plugin-lit-css';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import yaml from '@rollup/plugin-yaml';
import { copy } from '@web/rollup-plugin-copy';
import { defineConfig } from 'rollup';

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

    litcss(),
    yaml(),
    resolve(),
    minifyHTML(),

    copy({
      patterns: '_headers'
    }),

    summary()
  ]
});
