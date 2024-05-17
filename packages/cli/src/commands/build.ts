import '@pixas/common/lib/env/prod';
import { program } from 'commander';
import signale from 'signale';
import { app } from '@pixas/common';
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
  .option('-b, --bundler [bundler]', 'bundler to use', app.config.bundler || 'webpack')
  .action(async () => {
    try {
      const { bundler: bundleType } = program.opts<BuildProgramOptions>();

      const Bundler = await getBundlerByType(bundleType);

      const bundler = new Bundler();
      await bundler.build();
    } catch (err: any) {
      if (err?.message) {
        signale.error(err.message);
      }
      process.exit(1);
    }
  })
  .parse(process.argv);
