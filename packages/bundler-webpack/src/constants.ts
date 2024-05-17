import { paths } from '@pixas/common';
import path from 'node:path';

export const webpackConfigPaths = [
  'webpack.config.ts',
  'webpack.config.js',
  'config/webpack.config.ts',
  'config/webpack.config.js',
].map((file) => path.resolve(paths.workDir, file));
