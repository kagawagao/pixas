import '../configs/env/dev';
import { program } from 'commander';
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils';
import { checkBrowsers } from 'react-dev-utils/browsersHelper';
import signale from 'signale';
import { StartOptions } from '../bundlers/types';
import * as app from '../configs/app';
import { AppBundler } from '../types';
import { getBundlerByType } from '../utils/bundler';

export interface DevProgramOptions extends Omit<StartOptions, 'mode' | 'host'> {
  bundler: AppBundler;
  ip?: string;
}

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-i, --ip [ip]', 'host to use', '0.0.0.0')
  .option('-p, --port [port]', 'port to use', parseInt, 3000)
  .option('-b, --bundler [bundler]', 'bundler to use', 'webpack')
  .action(async () => {
    try {
      const { bundler: bundleType, ip, port } = program.opts<DevProgramOptions>();

      const appConfig = await app.load();

      const Bundler = getBundlerByType(bundleType);

      const bundler = new Bundler(appConfig);

      const DEFAULT_PORT = parseInt((port || process.env.PORT || 3000).toString(), 10) || 3000;
      const HOST = ip || process.env.HOST || '0.0.0.0';

      const isInteractive = process.stdout.isTTY;

      await checkBrowsers(process.cwd(), isInteractive);
      const chosenPort = await choosePort(HOST, DEFAULT_PORT);
      if (!chosenPort) {
        throw new Error('No available port found');
      }
      await bundler.start({
        port: chosenPort,
        open: true,
        host: HOST,
      });
    } catch (err: any) {
      if (err?.message) {
        signale.error(err.message);
      }
      process.exit(1);
    }
  })
  .parse(process.argv);
