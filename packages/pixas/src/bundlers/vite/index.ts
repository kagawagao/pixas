import signale from 'signale';
import fs from 'fs-extra';
import BaseBundler from '../base';
import { StartOptions } from '../types';
import { createServer, build, UserConfig } from 'vite';
import { tplPath, workDir } from '../../configs/paths';
import ejs from 'ejs';
import configs from './config';
import { AppConfig } from '../../types';

export default class ViteBundler extends BaseBundler {
  private config: UserConfig;
  constructor(app: AppConfig) {
    super(app);

    this.config = configs[this.app.mode];
  }

  public start = async (opts: StartOptions) => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    // check if there is a index.html file in the root directory
    // if not, create a default one
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
    await build({
      ...this.config,
      // disable env file to avoid conflict with globals config
      envFile: false,
    });
  };
}
