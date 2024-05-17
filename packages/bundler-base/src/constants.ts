import path from 'node:path';
import { paths } from '@pixas/common';

export const webpackConfigPaths = [
  'webpack.config.ts',
  'webpack.config.js',
  'config/webpack.config.ts',
  'config/webpack.config.js',
].map((file) => path.resolve(paths.workDir, file));
