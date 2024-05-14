import chokidar from 'chokidar';
import signale from 'signale';
import { getEnvPaths, loadEnv } from '../../configs/env';
import BaseBundler from '../base';
import { StartOptions } from '../types';
import { webpackConfigPaths } from './constants';
import createDevServerProcess from './server';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import printBuildError from 'react-dev-utils/printBuildError';
import webpack from 'webpack';
import configs from './config';

export default class WebpackBundler extends BaseBundler {
  public start = async (opts: StartOptions) => {
    const watchPaths = [...getEnvPaths(), ...webpackConfigPaths];
    const fileWatcher = chokidar.watch(watchPaths.filter(Boolean), {
      persistent: true,
      ignoreInitial: true,
    });

    signale.start('Starting the development server...\n');
    const child = createDevServerProcess({
      host: opts.host ?? '0.0.0.0',
      port: opts.port ?? 3000,
      mode: this.app.mode ?? 'spa',
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

  public build = async () => {
    signale.info('Compile start');

    const compiler = webpack(configs[this.app.mode]);

    // create compiler
    compiler.run((err, stats) => {
      let messages;
      // normal error from process
      if (err) {
        let errMessage = err.message;

        if (errMessage) {
          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
            errMessage += '\nCompileError: Begins at CSS selector ' + (err as any).postcssNode.selector;
          }

          messages = formatWebpackMessages({
            errors: [errMessage],
            warnings: [],
          });
        }
      } else {
        messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        messages = messages.errors.join('\n\n');
      }

      if (stats.hasErrors()) {
        const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
        if (tscCompileOnError) {
          signale.error(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n',
          );
          printBuildError(messages);
        } else {
          signale.error('Failed to compile.\n');
          printBuildError(messages);
          process.exit(1);
        }
      } else if (stats.hasWarnings()) {
        signale.warn('Compiled with warnings.\n');
        console.log(messages.warnings.join('\n\n'));
      } else {
        signale.success('Compiled successfully.\n');
      }

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      compiler.close(() => {});
    });
  };
}
