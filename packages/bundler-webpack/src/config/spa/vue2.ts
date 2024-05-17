import { Configuration } from 'webpack';
import { paths } from '@pixas/common';

export default function (config: Configuration) {
  config.resolve!.extensions!.unshift('.mjs');
  config.resolve!.extensions!.unshift('.vue');
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

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { VueLoaderPlugin } = require(require.resolve('vue-loader'));

  config.plugins!.push(new VueLoaderPlugin());

  return config;
}
