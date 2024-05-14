import flexbugsFixesPlugin from 'postcss-flexbugs-fixes';
import presetEnvPlugin from 'postcss-preset-env';
import normalizePlugin from 'postcss-normalize';

const postcssConfig = {
  map: true,
  plugins: [
    flexbugsFixesPlugin,
    presetEnvPlugin({
      stage: 0,
    }),
    normalizePlugin(),
  ],
};

export default postcssConfig;
