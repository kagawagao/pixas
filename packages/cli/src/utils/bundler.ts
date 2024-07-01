import Bundler from '@pixas/bundler-base';
import { AppBundler } from '../types';

export const bundlerMap = {
  webpack: () => import('@pixas/bundler-webpack').then((mod) => mod.default),
  vite: () => import('@pixas/bundler-vite').then((mod) => mod.default),
  mako: () => import('@pixas/bundler-mako').then((mod) => mod.default),
};

export async function getBundlerByType(type: AppBundler) {
  const ResolvedBundler = await bundlerMap[type]();
  if (!Bundler) {
    throw new Error(`Bundler ${type} not found`);
  }
  return ResolvedBundler;
}
