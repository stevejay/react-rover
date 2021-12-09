const { loadConfigFromFile, mergeConfig } = require('vite');
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite'
  },
  // Workaround for https://github.com/storybookjs/storybook/issues/16099
  webpackFinal(config) {
    delete config.resolve.alias['emotion-theming'];
    delete config.resolve.alias['@emotion/styled'];
    delete config.resolve.alias['@emotion/core'];
    return config;
  },
  // Workaround for https://github.com/eirslett/storybook-builder-vite/issues/85
  async viteFinal(config /*, { configType }*/) {
    const { config: userConfig } = await loadConfigFromFile(path.resolve(__dirname, '../vite.config.ts'));
    return mergeConfig(config, {
      resolve: userConfig.resolve,
      // Hack for https://github.com/eirslett/storybook-builder-vite/issues/173#issuecomment-989264127
      optimizeDeps: {
        ...config.optimizeDeps,
        // Entries are specified relative to the root
        entries: [`${path.relative(config.root, path.resolve(__dirname, '../src'))}/**/*.stories.tsx`],
        include: [
          ...(config?.optimizeDeps?.include ?? []),
          '@storybook/theming',
          'react-icons/fa',
          '@storybook/addon-actions',
          '@emotion/react/jsx-dev-runtime',
          'merge-refs'
        ]
      }
    });
  }
};
