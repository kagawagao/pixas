import * as bundlers from '../bundlers';
import { AppBundler } from '../types';

export const bundlerMap = {
  webpack: bundlers.WebpackBundler,
  vite: bundlers.ViteBundler,
};

export function getBundlerByType(type: AppBundler) {
  const Bundler = bundlerMap[type];
  if (!Bundler) {
    throw new Error(`Bundler ${type} not found`);
  }
  return Bundler;
}
