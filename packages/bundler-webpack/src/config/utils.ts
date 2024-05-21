import { app, postcss } from '@pixas/common';
import { supportTypeScript } from '@pixas/common/lib/utils/language';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetUseItem } from 'webpack';

const DEV = process.env.NODE_ENV === 'development';

export function getCSSLoader(lang: 'css' | 'less' | 'sass' | 'scss', isServer = false) {
  const loaders: RuleSetUseItem[] = [
    app.config.mode === 'spa' && DEV
      ? {
          loader: require.resolve('style-loader'),
          options: {},
        }
      : {
          loader: MiniCSSExtractPlugin.loader,
          options: {
            esModule: true,
            emit: !isServer,
          },
        },
  ];
  if (supportTypeScript) {
    loaders.push({
      loader: require.resolve('@opd/css-modules-typings-loader'),
    });
  }
  loaders.push(
    ...[
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: lang === 'css' ? 1 : 2,
          sourceMap: true,
          esModule: true,
          modules: {
            localIdentName: DEV ? '[path][name]__[local]' : '[hash:base64]',
            exportLocalsConvention: 'camelCaseOnly',
            auto: true,
            namedExport: false,
            // exportOnlyLocals: isServer,
          },
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: true,
          postcssOptions: {
            ...postcss.config,
            config: true,
          },
        },
      },
    ],
  );
  if (lang === 'less') {
    loaders.push({
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    });
  }
  return loaders;
}
