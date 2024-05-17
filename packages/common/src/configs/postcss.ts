import flexbugsFixesPlugin from 'postcss-flexbugs-fixes';
import presetEnvPlugin from 'postcss-preset-env';
import normalizePlugin from 'postcss-normalize';

export const config = {
  map: true,
  plugins: [
    flexbugsFixesPlugin,
    presetEnvPlugin({
      stage: 0,
    }),
    normalizePlugin(),
  ],
};
