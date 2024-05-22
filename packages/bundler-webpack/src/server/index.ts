import { AppType } from '@pixas/common';
import { fork } from 'node:child_process';
import fs from 'node:fs';
import signale from 'signale';

const serverModes: Partial<Record<AppType, string>> = {
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
