#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { program } from 'commander';
import path from 'node:path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../package.json';

/**
 * Usage
 */
program
  .version(pkg.version)
  .description('pixas develop toolkit')
  .usage('<command> [options]')
  .command('dev', 'start a server with HMR in local', {
    executableFile: path.resolve(__dirname, './commands/dev'),
  })
  .command('build', 'build dist files for production', {
    executableFile: path.resolve(__dirname, './commands/build'),
  })
  .command('i18n', 'extract i18n messages', {
    executableFile: path.resolve(__dirname, './commands/i18n'),
  })
  .command('dts', 'generate swagger interfaces to .d.ts', {
    executableFile: path.resolve(__dirname, './commands/dts'),
  })
  .command('env', 'generate .env file config', {
    executableFile: path.resolve(__dirname, './commands/env'),
  })
  .parse(process.argv);
