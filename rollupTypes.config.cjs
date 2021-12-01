const path = require('path');
const dts = require('rollup-plugin-dts').default;
const alias = require('@rollup/plugin-alias');

// From https://github.com/vuetifyjs/vuetify/blob/next/packages/vuetify/build/rollup.types.config.js

const externalsPlugin = () => ({
  resolveId(source, importer) {
    if (importer && source.endsWith('.css')) {
      return {
        id: source,
        external: true,
        moduleSideEffects: false
      };
    }
  }
});

function createTypesConfig(input, output) {
  return {
    input: 'types-temp/' + input,
    output: [{ file: output, format: 'es' }],
    plugins: [
      dts(),
      externalsPlugin(),
      alias({
        entries: [
          {
            find: /^@\/(.*)/,
            replacement: path.resolve(__dirname, './types-temp/$1')
          }
        ]
      })
    ]
  };
}

const config = [createTypesConfig('index.d.ts', 'dist/index.d.ts')];
module.exports = config;
