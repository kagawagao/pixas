#!/usr/bin/env node
import { OpenAPIPlugin, OpenAPIRunner } from '@opas/core';
import AppPlugin from '@opas/plugin-app';
import { app, paths, repo } from '@pixas/common';
import '@pixas/common/lib/env';
import chalk from 'chalk';
import { program } from 'commander';
import path from 'node:path';
import signale from 'signale';
import { DtsModule } from '../types';

program
  .option('-n, --namespace <namespaces...>', 'filter namespace')
  .description('generate open api request client, include service, api, definition')
  .action(async () => {
    let modules: DtsModule[] = [];
    const { dts, isMono = repo.isMonoRepo(paths.workDir) } = app.config;
    if (dts) {
      if (dts.modules?.length > 0) {
        modules = dts.modules;
      } else {
        process.exit(0);
      }
    }

    const { namespace } = program.opts<{ namespace: string[] }>();

    function getPathFromWorkDir(...args: string[]) {
      return path.resolve(paths.workDir, ...args);
    }

    const serviceDir = isMono ? getPathFromWorkDir('packages/shared/services') : getPathFromWorkDir('src/services');
    const apiDir = isMono ? getPathFromWorkDir('packages/shared/apis') : getPathFromWorkDir('src/apis');
    const dtsDir = isMono ? getPathFromWorkDir('packages/shared/interfaces') : getPathFromWorkDir('src/interfaces');

    console.log();
    signale.start(chalk.greenBright('start generate dts'));
    console.log();

    try {
      await OpenAPIRunner.run(
        modules
          .filter((item) => {
            if (namespace && namespace.length > 0) {
              return namespace.includes(item.namespace);
            } else {
              return true;
            }
          })
          .map((config) => {
            const { url, namespace, basePath, extractField } = config;
            const plugins: OpenAPIPlugin<any>[] = [
              new AppPlugin({
                serviceDir,
                apiDir,
                dtsDir,
                writeFileMode: {
                  api: 'overwrite' as any,
                  service: 'skip' as any,
                },
                baseUrl: basePath,
                extractField,
              }),
            ];
            return {
              url,
              namespace,
              plugins,
            };
          }),
      );
    } catch (error) {
      signale.warn(`${namespace} generate failed`);
    }
    console.log();
    signale.complete(chalk.greenBright('generate dts complete'));
    console.log();
  })
  .parse(process.argv);
