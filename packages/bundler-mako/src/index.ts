import Bundler, { StartOptions } from '@pixas/bundler-base';
import { paths } from '@pixas/common';
import { build } from '@umijs/mako';
import ejs from 'ejs';
import fs from 'fs-extra';
import signale from 'signale';
import configs from './config';
import { MakoConfig } from './types';

const { tplPath, workDir } = paths;

export default class MakoBundler extends Bundler {
  private config: MakoConfig;
  constructor() {
    super();

    this.config = configs[this.type]!;
  }

  /**
   * Check if there is a index.html file in the root directory
   */
  private checkIndexHtml = async () => {
    // if not exists, create a default one
    const indexHtml = `${workDir}/index.html`;
    if (!fs.existsSync(indexHtml)) {
      const template = await fs.readFile(tplPath, 'utf-8');
      const html = await ejs.render(
        template,
        {
          htmlWebpackPlugin: {
            options: {
              title: this.app.name,
            },
          },
        },
        {
          async: true,
        },
      );

      await fs.writeFile(indexHtml, html);
    }
  };

  public start = async (opts: StartOptions) => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    await this.checkIndexHtml();
    signale.start('Starting the development server...\n');
    this.run(opts, true);
  };

  public build = async () => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    await this.checkIndexHtml();
    this.run({}, false);
  };

  private run = async (opts: StartOptions, watch = false) => {
    return build({
      watch,
      root: process.cwd(),
      config: this.config,
    });
  };
}
