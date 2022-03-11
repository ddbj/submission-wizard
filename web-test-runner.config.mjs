import _commonjs from '@rollup/plugin-commonjs';
import _litcss from 'rollup-plugin-lit-css';
import _yaml from '@rollup/plugin-yaml';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';

const commonjs = fromRollup(_commonjs);
const litcss   = fromRollup(_litcss);
const yaml     = fromRollup(_yaml);

export default {
  files: 'test/**/*.test.ts',

  plugins: [
    esbuildPlugin({ts: true}),
    commonjs(), // micro-base
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
