import _postcss from 'rollup-plugin-postcss';
import _yaml from '@rollup/plugin-yaml';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

const postcss = fromRollup(_postcss);
const yaml    = fromRollup(_yaml);

export default {
  appIndex: 'demo/index.html',
  watch: true,
  open: true,

  plugins: [
    esbuildPlugin({
      ts: true
    }),

    postcss({
      inject: false
    }),

    yaml()
  ],

  mimeTypes: {
    '**/*.yml': 'js',
    '**/*.css': 'js'
  },

  nodeResolve: {
    exportConditions: 'development'
  }
};
