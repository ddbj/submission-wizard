import _litcss from 'rollup-plugin-lit-css';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

import _yaml from './rollup/yaml.mjs';

const litcss = fromRollup(_litcss);
const yaml   = fromRollup(_yaml);

export default {
  files: 'test/**/*.test.ts',

  plugins: [
    esbuildPlugin({ts: true}),
    litcss(),
    yaml()
  ],

  mimeTypes: {
    '**/*.css': 'js',
    '**/*.yml': 'js'
  },

  nodeResolve: {
    exportConditions: ['development']
  }
};
