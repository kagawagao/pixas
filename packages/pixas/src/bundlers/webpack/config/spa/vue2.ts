import { argv } from 'yargs';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { srcDir } from '../../../../configs/paths';
import { supportTypeScript } from '../../../../utils/language';
import { Configuration } from 'webpack';

export default function (config: Configuration) {
  config.resolve!.extensions!.unshift('.mjs');
  config.resolve!.extensions!.unshift('.vue');
  config.module!.rules!.unshift({
    test: /\.vue$/,
    include: [srcDir],
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('vue-loader'),
      },
    ],
  });

  if ((argv as any).tsCheck && supportTypeScript) {
    config.plugins!.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { VueLoaderPlugin } = require(require.resolve('vue-loader'));

  config.plugins!.push(new VueLoaderPlugin());

  return config;
}
