import { argv } from 'yargs';
import { srcDir } from '../../../../configs/paths';
import { supportTypeScript } from '../../../../utils/language';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
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
    include: [srcDir],
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('vue-loader'),
        options: {
          babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
        },
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
