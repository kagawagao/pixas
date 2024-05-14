import '../configs/env/prod';
import { program } from 'commander';
import signale from 'signale';
import * as app from '../configs/app';
import { getBundlerByType } from '../utils/bundler';
import { AppBundler } from '../types';

export interface BuildProgramOptions {
  bundler: AppBundler;
}

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-b, --bundler [bundler]', 'bundler to use', 'webpack')
  .action(async () => {
    try {
      const { bundler: bundleType } = program.opts<BuildProgramOptions>();

      const appConfig = await app.load();

      const Bundler = getBundlerByType(bundleType);

      const bundler = new Bundler(appConfig);
      await bundler.build();
    } catch (err: any) {
      if (err?.message) {
        signale.error(err.message);
      }
      process.exit(1);
    }
  })
  .parse(process.argv);
