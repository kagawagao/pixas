import Bundler, { StartOptions } from '@pixas/bundler-base';
import { paths } from '@pixas/common';
import ejs from 'ejs';
import fs from 'fs-extra';
import signale from 'signale';
import { UserConfig, build, createServer } from 'vite';
import configs from './config';

const { tplPath, workDir } = paths;

export default class ViteBundler extends Bundler {
  private config: UserConfig;
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
    const server = await createServer({
      ...this.config,
      // disable env file to avoid conflict with globals config
      envFile: false,
      server: {
        port: opts.port,
        host: opts.host,
        open: opts.open,
      },
    });

    await server.listen();
    server.printUrls();
  };

  public build = async () => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    await this.checkIndexHtml();
    await build({
      ...this.config,
      // disable env file to avoid conflict with globals config
      envFile: false,
    });
  };
}
