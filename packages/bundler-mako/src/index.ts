import Bundler, { StartOptions } from '@pixas/bundler-base';
import { global, paths } from '@pixas/common';
import { build } from '@umijs/mako';
import ejs from 'ejs';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import path from 'node:path';
import signale from 'signale';
import configs from './config';
import { MakoConfig } from './types';

const { tplPath, outputDir } = paths;

export default class MakoBundler extends Bundler {
  private config: MakoConfig;
  constructor() {
    super();

    this.config = configs[this.type]!;
  }

  private generateEntryHtml = async (entry: string) => {
    // if not exists, create a default one
    const entryHtml = `${outputDir}/${entry}.html`;
    const publicPath = this.config.publicPath || '/';
    const entryPath = path.join(publicPath, entry + '.js');
    const cssFilePath = path.resolve(outputDir, entry + '.css');
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

    const dom = new JSDOM(html);
    const configScript = dom.window.document.createElement('script');
    const configPath = path.join(publicPath, 'config.js');
    configScript.src = configPath;
    dom.window.document.head.appendChild(configScript);

    const entryScript = dom.window.document.createElement('script');
    entryScript.src = entryPath;
    entryScript.defer = true;
    dom.window.document.head.appendChild(entryScript);
    // if css file exists, add it to the head
    if (fs.existsSync(cssFilePath)) {
      const cssLink = dom.window.document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = path.join(publicPath, entry + '.css');
      dom.window.document.head.appendChild(cssLink);
    }

    const htmlWithScript = dom.serialize();

    await fs.writeFile(entryHtml, htmlWithScript);
  };

  public start = async (opts: StartOptions) => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    signale.start('Starting the development server...\n');
    this.config = {
      ...this.config,
      devServer: {
        port: opts.port,
        host: opts.host,
      },
    };
    this.run(true);
  };

  public build = async () => {
    if (this.app.mode !== 'spa') {
      signale.error('Vite only supports SPA mode at now.');
      return;
    }
    this.run(false);
  };

  private run = async (watch = false) => {
    const { compileGlobalVars, runtimeGlobalVars } = global.getGlobalConfig();
    const defines: Record<string, any> = {};
    // handle compileGlobalVars
    Object.entries(compileGlobalVars).forEach(([key, value]) => {
      if (key !== 'process.env.NODE_ENV') {
        // mako auto injects process.env.NODE_ENV
        defines[key.replace('process.env.', '')] = value;
      }
    });
    // handle runtimeGlobalVars
    Object.keys(runtimeGlobalVars).forEach((key) => {
      defines[key] = `process.env.${key}`;
    });

    return build({
      watch,
      root: process.cwd(),
      config: {
        ...this.config,
        define: defines,
        plugins: [
          {
            name: 'mako-plugin-html',
            generateEnd: async () => {
              const content = await global.getRuntimeGlobalVarsContent();

              fs.writeFileSync(path.resolve(outputDir, 'config.js'), content);
              const { entry } = this.config;
              if (entry) {
                await Promise.all(
                  Object.keys(entry).map(async (key) => {
                    await this.generateEntryHtml(key);
                  }),
                );
              }
            },
          },
        ],
      },
    });
  };
}
