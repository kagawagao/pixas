import yargs, { Arguments } from 'yargs';
import { fork } from 'node:child_process';
import fs from 'node:fs';
import signale from 'signale';
import { AppMode } from '../../../types';

const serverModes: Partial<Record<AppMode, string>> = {
  spa: require.resolve('./spa/index.js'),
  // ssr: require.resolve('./ssr/index.js'),
};

interface ServerProcessOptions {
  host: string;
  port: string | number;
  mode: keyof typeof serverModes;
}

function createDevServerProcess({ host, port, mode }: ServerProcessOptions) {
  const args = ['--port', port.toString(), '--host', host];
  if ((yargs.argv as { [key in keyof Arguments<any>]: Arguments<any>[key] }).tsCheck) {
    args.push('--ts-check');
  }
  if ((yargs.argv as { [key in keyof Arguments<any>]: Arguments<any>[key] }).esCheck) {
    args.push('--es-check');
  }
  const serverExecutePath = serverModes[mode];
  if (serverExecutePath && fs.existsSync(serverExecutePath)) {
    return fork(serverExecutePath, args, {
      stdio: 'inherit',
    });
  } else {
    signale.error('Mode not support');
    process.exit(1);
  }
}

export default createDevServerProcess;
