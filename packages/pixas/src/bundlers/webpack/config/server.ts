import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import ignoredFiles from 'react-dev-utils/ignoredFiles';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';
import { Configuration } from 'webpack-dev-server';
import { publicDir, srcDir } from '../../../configs/paths';

const createServer = (host: string, port: number, publicPath = '/'): Configuration => ({
  port,
  host,
  compress: true,
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
  hot: true,
  devMiddleware: {
    publicPath,
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      entrypoints: false,
      children: false,
      version: false,
      assets: false,
    },
  },
  setupExitSignals: true,
  client: {
    logging: 'info',
    overlay: true,
    progress: false,
    webSocketTransport: 'ws',
    webSocketURL: {
      port,
      pathname: '/ws',
    },
  },
  static: {
    directory: publicDir,
    publicPath,
    watch: {
      ignored: ignoredFiles(srcDir),
    },
  },
  historyApiFallback: {
    disableDotRule: true,
    index: publicPath,
  },
  watchFiles: [publicDir + '/**/*'],
  setupMiddlewares(middlewares, devServer) {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }

    middlewares.unshift(
      // Keep `evalSourceMapMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      evalSourceMapMiddleware(devServer as any),
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      noopServiceWorkerMiddleware(publicPath),
    );

    return middlewares;
  },
});

export default createServer;
