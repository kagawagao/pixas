import Bundler, { StartOptions } from '@pixas/bundler-base';
import { paths, global } from '@pixas/common';
import fs from 'fs-extra';
import signale from 'signale';
import { createRsbuild } from '@rsbuild/core';
import configs from './config';

const { publicDir } = paths;

export default class RsbuildBundler extends Bundler {
  private writeRuntimeConfig = async () => {
    const content = await global.getRuntimeGlobalVarsContent();
    await fs.ensureDir(publicDir);
    fs.writeFileSync(`${publicDir}/config.js`, content);
  };

  public start = async (opts: StartOptions) => {
    if (this.app.mode !== 'spa') {
      signale.error('Rsbuild only supports SPA mode at now.');
      return;
    }
    await this.writeRuntimeConfig();
    signale.start('Starting the development server...\n');
    const rsbuild = await createRsbuild({
      rsbuildConfig: {
        ...configs[this.type],
        server: {
          port: opts.port,
          host: opts.host,
          open: opts.open,
        },
      },
    });
    await rsbuild.startDevServer();
  };

  public build = async () => {
    if (this.app.mode !== 'spa') {
      signale.error('Rsbuild only supports SPA mode at now.');
      return;
    }
    await this.writeRuntimeConfig();
    const rsbuild = await createRsbuild({
      rsbuildConfig: configs[this.type],
    });
    await rsbuild.build();
  };
}
