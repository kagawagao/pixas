import '@pixas/common/lib/env/prod';
import { app, env } from '@pixas/common';
import { program } from 'commander';
import signale from 'signale';
import { AppBundler } from '../types';
import { getBundlerByType } from '../utils/bundler';

export interface BuildProgramOptions {
  bundler: AppBundler;
  env?: string;
}

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-b, --bundler [bundler]', 'bundler to use', app.config.bundler || 'webpack')
  .option('-e, --env [env]', 'env to use')
  .action(async () => {
    try {
      const { bundler: bundleType, env: mode } = program.opts<BuildProgramOptions>();

      if (mode) {
        process.env.BIZ_ENV = mode;
        env.loadEnv();
      }

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
