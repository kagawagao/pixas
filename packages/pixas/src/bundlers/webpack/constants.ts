import path from 'node:path';
import { workDir } from '../../configs/paths';

export const webpackConfigPaths = [
  'webpack.config.ts',
  'webpack.config.js',
  'config/webpack.config.ts',
  'config/webpack.config.js',
].map((file) => path.resolve(workDir, file));
