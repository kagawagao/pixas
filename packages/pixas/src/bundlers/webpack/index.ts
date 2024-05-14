import { getEnvPaths, loadEnv } from '../../configs/env';
import { workDir } from '../../configs/paths';
import BaseBundler from '../base';
import { StartOptions } from '../types';
import createDevServerProcess from './server';
import path from 'node:path';
import chokidar from 'chokidar';
import signale from 'signale';

const webpackConfigPaths = [
  'webpack.config.ts',
  'webpack.config.js',
  'config/webpack.config.ts',
  'config/webpack.config.js',
].map((file) => path.resolve(workDir, file));

export default class WebpackBundler extends BaseBundler {
  public start = async (opts: StartOptions) => {
    const watchPaths = [...getEnvPaths(), ...webpackConfigPaths];
    const fileWatcher = chokidar.watch(watchPaths.filter(Boolean), {
      persistent: true,
      ignoreInitial: true,
    });

    const child = createDevServerProcess({
      host: opts.host ?? '0.0.0.0',
      port: opts.port ?? 3000,
      mode: 'spa',
    });

    const restart = () => {
      child.removeAllListeners();
      child.kill();
      fileWatcher.close();
      process.stdin.removeAllListeners();
      process.removeAllListeners();
      loadEnv();
      this.start(opts);
    };

    fileWatcher.on('all', (event, path) => {
      signale.await('Config file changed, restart dev server...');
      signale.info(`Changed file: ${path}`);
      restart();
    });

    process.stdin.on('data', (buf) => {
      const message = buf.toString('utf8').trim();

      if (message === 'rs' || message === 'restart') {
        signale.note('Restart development server');
        restart();
      }
    });

    child.on('error', () => {
      process.exit(1);
    });

    child.on('close', (code) => {
      process.exit(code);
    });
  };

  public build(): Promise<void> {
    return Promise.resolve();
  }
}
