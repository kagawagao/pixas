import Bundler from '@pixas/bundler-base';
import { AppBundler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BundlerConstructor = new (...args: any[]) => InstanceType<typeof Bundler>;

// Node.js import() of CJS modules with __esModule+exports.default wraps module.exports
// as the default: mod.default = module.exports = { default: Class }, so we need mod.default.default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveCjsDefault(mod: any): BundlerConstructor {
  const m = mod.default;
  return (typeof m === 'function' ? m : m?.default) as BundlerConstructor;
}

export const bundlerMap: Record<AppBundler, () => Promise<BundlerConstructor>> = {
  webpack: () => import('@pixas/bundler-webpack').then(resolveCjsDefault),
  vite: () => import('@pixas/bundler-vite').then(resolveCjsDefault),
  mako: () => import('@pixas/bundler-mako').then(resolveCjsDefault),
};

export async function getBundlerByType(type: AppBundler) {
  const ResolvedBundler = await bundlerMap[type]();
  if (!Bundler) {
    throw new Error(`Bundler ${type} not found`);
  }
  return ResolvedBundler;
}
