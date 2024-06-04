import fs from 'fs-extra';
import path from 'node:path';
import prettier from 'prettier';
import { formatGlobalVars } from '../env';
import { isMonoRepo } from '../utils/repo';
import { config as app } from './app';
import { publicDir, srcDir, workDir } from './paths';

import { isNil } from 'lodash';
import { getLoadedEnvs, getSharedEnvs } from '../env/base';

const globalDefinitionFilePath = path.resolve(srcDir, 'globals.d.ts');
const configFilePath = path.resolve(publicDir, 'config.js');

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

const { compileGlobalVars, globalDefinitions, sharedGlobalDefinitions } = getGlobalConfig();

const basicDefinitionContent =
  app.mode === 'spa'
    ? `
        readonly NODE_ENV: 'development' | 'production' | 'test';`
    : `
        readonly NODE_ENV: 'development' | 'production' | 'test';
        readonly PORT: string | number;
        readonly IS_SERVER: boolean;
        readonly IS_BROWSER: boolean;`;

export const globalDefinitionsContent = `
declare namespace NodeJS {
  interface ProcessEnv {
    ${basicDefinitionContent}
    ${globalDefinitions}
  }
}
`;

export const sharedGlobalDefinitionsContent = `
declare namespace NodeJS {
  interface ProcessEnv {
    ${basicDefinitionContent}
    ${sharedGlobalDefinitions}
  }
}
`;

export async function writeDefinitionFile(filepath, content) {
  const prettierConfig = await prettier.resolveConfig(filepath);

  const formattedContent = await prettier.format(content, {
    ...prettierConfig,
    parser: 'typescript',
  });

  await fs.ensureDir(path.dirname(filepath));

  await fs.writeFile(filepath, formattedContent, {
    encoding: 'utf-8',
  });
}

export const getRuntimeGlobalVarsContent = async () => {
  const prettierConfig = await prettier.resolveConfig(configFilePath);

  return prettier.format(formatGlobalVars(getGlobalConfig().runtimeGlobalVars, 'js'), {
    ...prettierConfig,
    parser: 'babel',
  });
};

const monoRepoBaseDir = path.resolve(workDir, '../../');
const isUnderMono = isMonoRepo(monoRepoBaseDir);
const isMonoRepoRoot = isMonoRepo(workDir);

if (!isMonoRepoRoot) {
  writeDefinitionFile(globalDefinitionFilePath, globalDefinitionsContent);
}

if (isUnderMono) {
  const sharedDir = path.resolve(monoRepoBaseDir, 'packages/shared');
  if (fs.existsSync(sharedDir)) {
    const sharedGlobalDefinitionFilePath = path.resolve(monoRepoBaseDir, sharedDir, 'globals.d.ts');
    writeDefinitionFile(sharedGlobalDefinitionFilePath, sharedGlobalDefinitionsContent);
  }
}

if (!process.env.APP_NAME) {
  process.env.APP_NAME = app.name;
}

export default compileGlobalVars;
