import { paths } from '@pixas/common';
import { Configuration } from 'webpack';

export default function (config: Configuration) {
  config.resolve!.extensions!.unshift('.mjs');
  config.resolve!.extensions!.unshift('.vue');
  if (Array.isArray(config.resolve!.alias)) {
    config.resolve!.alias.push({
      alias: 'vue',
      name: '@vue/runtime-dom',
    });
  } else {
    config.resolve!.alias!.vue = '@vue/runtime-dom';
  }
  config.module!.rules!.unshift({
    test: /\.vue$/,
    include: [paths.srcDir],
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('vue-loader'),
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { VueLoaderPlugin } = require(require.resolve('vue-loader'));

  config.plugins!.push(new VueLoaderPlugin());
  return config;
}
