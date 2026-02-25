import Bundler from '@pixas/bundler-base';
import { AppBundler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BundlerConstructor = new (...args: any[]) => InstanceType<typeof Bundler>;

export const bundlerMap: Record<AppBundler, () => Promise<BundlerConstructor>> = {
  webpack: () => import('@pixas/bundler-webpack').then((mod) => mod.default as unknown as BundlerConstructor),
  vite: () => import('@pixas/bundler-vite').then((mod) => mod.default as unknown as BundlerConstructor),
  mako: () => import('@pixas/bundler-mako').then((mod) => mod.default as unknown as BundlerConstructor),
};

export async function getBundlerByType(type: AppBundler) {
  const ResolvedBundler = await bundlerMap[type]();
  if (!Bundler) {
    throw new Error(`Bundler ${type} not found`);
  }
  return ResolvedBundler;
}
