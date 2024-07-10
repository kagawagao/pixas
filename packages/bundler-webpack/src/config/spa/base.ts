import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import fs from 'fs';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import webpack, { Configuration } from 'webpack';
import WebpackBar from 'webpackbar';
// const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
import { global, paths } from '@pixas/common';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';
import { getCSSLoader } from '../utils';

const { entryPath, outputDir, publicDir, srcDir } = paths;

const PRODUCT = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV === 'development';

const config: Configuration = {
  mode: PRODUCT ? 'production' : 'development',
  entry: {
    app: entryPath,
  },
  cache: {
    type: 'filesystem',
  },
  output: {
    clean: true,
    publicPath: process.env.PUBLIC_PATH,
    path: outputDir,
    filename: PRODUCT ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: PRODUCT ? '[id].[contenthash].js' : '[id].js',
    assetModuleFilename: '[name].[hash][ext][query]',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css', '.less'],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
    alias: {
      '@': srcDir,
      lodash: 'lodash-es',
    },
  },
  devtool: DEV ? 'eval-cheap-module-source-map' : false,
  experiments: {
    lazyCompilation: DEV
      ? {
          entries: false,
          imports: true,
        }
      : false,
  },
  infrastructureLogging: {
    level: 'none',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        use: [],
      },
      {
        test: /\.(j|t)sx?$/,
        // include: [srcDir],
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /.css$/,
        use: getCSSLoader('css'),
      },
      {
        test: /.less$/,
        use: getCSSLoader('less'),
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf|png|jpe?g|gif|svg)$/,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: 'Pixas',
    }),
    new webpack.WatchIgnorePlugin({
      paths: [/(css|less)\.d\.ts$/],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /(moment|moment\/dist)$/,
    }),
    new webpack.DefinePlugin({
      ...global.getGlobalConfig().compileGlobalVars,
      // for vue
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
    }),
    new ModuleNotFoundPlugin(),
    new MiniCSSExtractPlugin({
      ignoreOrder: true,
      filename: DEV ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: DEV ? '[id].css' : '[id].[contenthash].css',
    }),
  ],
  optimization: {
    minimize: PRODUCT,
    minimizer: [
      new TerserWebpackPlugin({
        // swc not work on ci
        // minify: TerserWebpackPlugin.swcMinify,
        // terserOptions: {},
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
};

if (DEV) {
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins!.push(
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  );
}

if (PRODUCT) {
  config.plugins!.push(
    new GenerateSW({
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      exclude: [/\.map$/, /asset-manifest\.json$/, /config\.js$/],
      // navigateFallback: 'index.html',
      // navigateFallbackBlacklist: [
      //   // Exclude URLs starting with /_, as they're likely an API call
      //   new RegExp('^/_'),
      //   // Exclude URLs containing a dot, as they're likely a resource in
      //   // public/ and not a SPA route
      //   new RegExp('/[^/]+\\.[^/]+$'),
      // ],
    }),
  );

  const hasPublicDir = fs.existsSync(publicDir);

  if (hasPublicDir) {
    config.plugins!.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: publicDir,
            noErrorOnMissing: true,
            globOptions: {
              ignore: ['**/*.ejs', '**/*.md'],
            },
          },
        ],
      }),
    );
  }
}

export default config;
