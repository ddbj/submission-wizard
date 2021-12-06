import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import rollupYaml from '@rollup/plugin-yaml';

const yaml = fromRollup(rollupYaml);

export default {
  appIndex: 'demo/index.html',

  plugins: [
    esbuildPlugin({ts: true}),
    yaml()
  ],

  mimeTypes: {
    '**/*.yml': 'js'
  },

  nodeResolve: {
    exportConditions: 'development'
  }
};
