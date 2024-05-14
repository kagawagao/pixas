import { isNil } from 'lodash';
import { getLoadedEnvs, getSharedEnvs } from '../configs/env/base';
import { config as app } from '../configs/app';

if (!process.env.APP_NAME) {
  process.env.APP_NAME = app.name;
}

export const getGlobalConfig = () => {
  /**
   * internal compile time global variables
   */
  const internalGlobals: string[] = ['NODE_ENV', 'BIZ_ENV', 'APP_NAME', 'APP_VERSION', 'PUBLIC_PATH'];

  /**
   * internal runtime global variables
   */
  const internalWindowGlobals: string[] = ['APP_NAME', 'PUBLIC_PATH'].filter((key) => !isNil(process.env[key]));

  /**
   * runtime global variables prefixes
   */
  const windowGlobalPrefixes: string[] = ['APP'];
  let injectGlobals: string[] = [];
  let windowGlobals: string[] = [];

  const { globals } = app;

  if (globals) {
    if (Array.isArray(globals)) {
      injectGlobals = Array.from(new Set([...internalGlobals, ...globals]));
    } else {
      const { compile = [], runtime = [] } = globals;
      injectGlobals = Array.from(new Set([...internalGlobals, ...compile].filter((v) => !runtime.includes(v))));
      windowGlobals = Array.from(new Set([...internalGlobals, ...runtime]));
    }
  } else {
    windowGlobals = internalWindowGlobals.concat(
      Object.keys(process.env).filter((v) => windowGlobalPrefixes.some((prefix) => v.startsWith(prefix))),
    );
    injectGlobals = internalGlobals.concat(
      Object.keys(getLoadedEnvs()).filter((v) => !injectGlobals.includes(v) && windowGlobals.includes(v)),
    );
  }

  if (process.env.NODE_ENV === 'development') {
    injectGlobals = Array.from(new Set([...injectGlobals, ...windowGlobals]));
  }

  const compileGlobalVars = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.BIZ_ENV': JSON.stringify(process.env.BIZ_ENV || process.env.NODE_ENV),
    'process.env.APP_VERSION': JSON.stringify(app.version),
  };

  const runtimeGlobalVars: Record<string, string> = {};

  injectGlobals.forEach((key) => {
    if (!(`process.env.${key}` in compileGlobalVars) && !windowGlobals.includes(key)) {
      const value = process.env[key];
      compileGlobalVars[`process.env.${key}`] = JSON.stringify(value);
    }
  });

  windowGlobals.forEach((key) => {
    if (!(key in runtimeGlobalVars)) {
      const value = process.env[key];
      if (value) {
        runtimeGlobalVars[key] = value;
      }
    }
  });

  const mergedGlobalVars = Array.from(new Set([...injectGlobals, ...windowGlobals]));

  const sharedGlobalVars = Array.from(
    new Set([...internalGlobals, ...internalWindowGlobals, ...Object.keys(getSharedEnvs())]),
  );

  const globalDefinitions = mergedGlobalVars
    .filter((key) => key !== 'NODE_ENV')
    .map((key) => `readonly ${key}: string`)
    .join('\n');

  const sharedGlobalDefinitions = sharedGlobalVars
    .filter((key) => key !== 'NODE_ENV')
    .map((key) => `readonly ${key}: string`)
    .join('\n');

  return {
    compileGlobalVars,
    runtimeGlobalVars,
    globalDefinitions,
    mergedGlobalVars,
    sharedGlobalVars,
    sharedGlobalDefinitions,
  };
};
