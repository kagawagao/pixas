import { app as appScope, framework, paths } from '@pixas/common';
import chalk from 'chalk';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'node:fs';
import path from 'node:path';
import signale from 'signale';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import InjectEnvPlugin from '../../plugins/inject-env-plugin';
import { appConfig } from './app';
import baseConfig from './base';
import vueConfigFunc from './vue';

const { config: app } = appScope;

const { tplPath, workDir } = paths;

// const PRODUCT = process.env.NODE_ENV === 'production';

const frameworkConfig = framework.isVue
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    vueConfigFunc(baseConfig)
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
    baseConfig;

const config: Configuration =
  typeof appConfig === 'function' ? appConfig(frameworkConfig, false) : merge(frameworkConfig, appConfig);

if (config.entry) {
  const entry = config.entry;

  if (typeof entry === 'object' && Object.keys(entry).length > 1) {
    const entries = Object.keys(entry);

    entries.forEach((name, index) => {
      config.plugins!.push(
        new HtmlWebpackPlugin({
          filename: `${index === 0 ? 'index' : name}.html`,
          template: tplPath,
          title: process.env.APP_NAME || '',
        }),
      );
    });
  } else {
    config.plugins!.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: tplPath,
        title: process.env.APP_NAME || '',
      }),
    );
  }

  config.plugins!.push(new InjectEnvPlugin());

  // if (PRODUCT) {
  //   config.plugins.push(
  //     new PWAManifestPlugin({
  //       name: app.name,
  //       short_name: app.name,
  //       description: app.description,
  //       crossorigin: 'anonymous',
  //       theme_color: '#014fe0',
  //       filename: 'manifest.json',
  //       icons: [
  //         {
  //           src: 'favicon-48x48.png',
  //           size: '48x48',
  //         },
  //       ],
  //     }) as any,
  //   );
  // }
}

if (app.logo) {
  const logo = path.resolve(workDir, app.logo);
  if (fs.existsSync(logo)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('favicons');
      config.plugins!.push(
        new FaviconsWebpackPlugin({
          logo,
          logoMaskable: logo,
          cache: true,
          prefix: '',
          inject: true,
          favicons: {
            appName: app.name,
            appDescription: app.description,
            appShortName: app.name,
            theme_color: '#014fe0',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '.',
            version: app.version,
            manifestMaskable: true,
            lang: 'zh-CN',
            icons: {
              favicons: true,
              android: true,
              appleIcon: true,
              appleStartup: false,
              windows: true,
              yandex: false,
            },
          },
        }),
      );
    } catch (error) {}
  } else {
    signale.error(chalk.redBright(`${logo} not found!`));
    process.exit(1);
  }
}

export default config;
