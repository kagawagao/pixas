/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@pixas/common/lib/env/dev';
import { pkg } from '@pixas/common';
import { openBrowserWithConfig } from '@pixas/common/lib/utils/open';
import clearConsole from 'react-dev-utils/clearConsole';
import { createCompiler, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { argv } from 'yargs';
import createServerConfig from '../../config/server';
import webpackConfig from '../../config/spa';

const { name: appName } = pkg;

const { host, port } = argv as any;

const isInteractive = process.stdout.isTTY;

let { publicPath = process.env.PUBLIC_PATH } = webpackConfig.output!;

if (publicPath === 'auto') {
  publicPath = '/';
}

const serverConfig = createServerConfig(host as string, port as number, publicPath as string);

const mergedServerConfig: WebpackDevServer.Configuration = {
  ...serverConfig,
  ...webpackConfig.devServer,
};

const isHttps = mergedServerConfig.https;

if (isHttps && typeof mergedServerConfig.client === 'object') {
  if (!mergedServerConfig.client.webSocketURL) {
    mergedServerConfig.client.webSocketURL = {
      protocol: 'wss',
      port,
      pathname: '/ws',
    };
  } else if (typeof mergedServerConfig.client.webSocketURL === 'object') {
    mergedServerConfig.client.webSocketURL.protocol = 'wss';
  }
}

// @ts-ignore
const urls = prepareUrls(isHttps ? 'https' : 'http', host, port, publicPath);

const compiler = createCompiler({
  appName,
  urls,
  config: webpackConfig,
  webpack,
});

const devServer = new WebpackDevServer(mergedServerConfig, compiler);

(async () => {
  try {
    await devServer.start();
    if (isInteractive) {
      clearConsole();
    }
    openBrowserWithConfig(host, port, typeof isHttps === 'boolean' ? isHttps : !!mergedServerConfig.https);
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((sig: any) => {
      process.on(sig, () => {
        process.exit();
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
