import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import postcssConfig from '../../../configs/postcss';
import { RuleSetUseItem } from 'webpack';
import { config as app } from '../../../configs/app';

const DEV = process.env.NODE_ENV === 'development';

export function getCSSLoader(lang: 'css' | 'less' | 'sass' | 'scss', isServer = false) {
  const loaders: RuleSetUseItem[] = [
    app.mode === 'spa' && DEV
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
    {
      loader: require.resolve('@opd/css-modules-typings-loader'),
    },
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
          // exportOnlyLocals: isServer,
        },
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: true,
        postcssOptions: {
          ...postcssConfig,
          config: true,
        },
      },
    },
  ];
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
