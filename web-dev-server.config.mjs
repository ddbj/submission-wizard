import _litcss from 'rollup-plugin-lit-css';
import _yaml from '@rollup/plugin-yaml';
import cors from '@koa/cors';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

const litcss = fromRollup(_litcss);
const yaml   = fromRollup(_yaml);

export default {
  appIndex: 'demo/index.html',

  middleware: [
    cors({
      origin: '*'
    })
  ],

  plugins: [
    esbuildPlugin({ts: true}),
    litcss(),

    litcss({
      include: ['**/*.svg'],
      tag:     'svg'
    }),

    yaml(),
  ],

  mimeTypes: {
    '**/*.css': 'js',
    '**/*.svg': 'js',
    '**/*.yml': 'js'
  },

  nodeResolve: {
    exportConditions: ['development']
  }
};
