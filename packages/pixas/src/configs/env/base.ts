import { config as dotenvConfig, DotenvConfigOptions } from 'dotenv';
import { expand } from 'dotenv-expand';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { register } from 'ts-node';
import { isMonoRepo } from '../../utils/mono-repo';
import { workDir } from '../paths';

// add *.ts config file support
register({
  transpileOnly: true,
});

const loadedEnvs: Record<string, string> = {};
const sharedEnvs: Record<string, string> = {};

let envPaths: string[] = [];

const config = (options: DotenvConfigOptions) => expand(dotenvConfig(options));

/**
 * clear loaded env
 */
export const clearLoadedEnv = () => {
  Object.keys(loadedEnvs).forEach((key) => {
    delete process.env[key];
  });
  Object.keys(sharedEnvs).forEach((key) => {
    delete process.env[key];
  });
};

/**
 * load env with base path
 * @param base base path
 * @param ignoreLocal whether ignore local env file
 */
export const loadEnvWithBase = (base: string, ignoreLocal = false) => {
  const envVars = {};
  const paths: string[] = [];

  // load local env
  const localEnvPath = resolve(base, '.env.local');
  if (existsSync(localEnvPath) && !ignoreLocal) {
    paths.push(localEnvPath);
    const { parsed } = config({
      path: localEnvPath,
    });
    Object.assign(envVars, parsed);
  }

  // load biz env
  const bizEnvPath = resolve(base, ['.env', process.env.BIZ_ENV || process.env.NODE_ENV].join('.'));
  if (existsSync(bizEnvPath)) {
    paths.push(bizEnvPath);
    const { parsed } = config({
      path: bizEnvPath,
    });
    Object.assign(envVars, parsed);
  }

  // load base env
  const baseEnvPath = resolve(base, '.env');
  if (existsSync(baseEnvPath)) {
    paths.push(baseEnvPath);
    const { parsed } = config({
      path: baseEnvPath,
    });
    Object.assign(envVars, parsed);
  }

  return {
    paths,
    envVars,
  };
};

/**
 * load env
 * @param ignoreLocal whether ignore local env file
 */
export const loadEnv = (ignoreLocal = false) => {
  // clear loaded env firstly
  clearLoadedEnv();
  envPaths = [];

  // load project env
  const { paths, envVars } = loadEnvWithBase(workDir, ignoreLocal);

  Object.assign(loadedEnvs, envVars);
  envPaths.push(...paths);

  const isUnderMono = isMonoRepo(resolve(workDir, '../../'));

  if (isUnderMono) {
    const { paths: monoPaths, envVars: monoEnvVars } = loadEnvWithBase(resolve(workDir, '../../'), ignoreLocal);
    Object.assign(loadedEnvs, monoEnvVars);
    Object.assign(sharedEnvs, monoEnvVars);
    envPaths.push(...monoPaths);
  }

  return {
    vars: loadedEnvs,
    paths: envPaths,
  };
};

/**
 * get env file paths
 * @returns env paths
 */
export const getEnvPaths = () => envPaths;

/**
 * get loaded env
 * @returns loaded env
 */
export const getLoadedEnvs = () => loadedEnvs;

/**
 * get shared env under mono repo
 */
export const getSharedEnvs = () => sharedEnvs;
