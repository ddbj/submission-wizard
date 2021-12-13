import _litcss from 'rollup-plugin-lit-css';
import _yaml from '@rollup/plugin-yaml';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

const litcss = fromRollup(_litcss);
const yaml   = fromRollup(_yaml);

export default {
  appIndex: 'demo/index.html',

  plugins: [
    esbuildPlugin({ts: true}),
    litcss(),
    yaml(),
  ],

  mimeTypes: {
    '**/*.css': 'js',
    '**/*.yml': 'js'
  },

  nodeResolve: {
    exportConditions: ['development']
  }
};
