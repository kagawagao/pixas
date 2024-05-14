import { srcDir, publicDir, workDir } from './paths';
import path from 'node:path';
import fs from 'fs-extra';
import prettier from 'prettier';
import { formatGlobalVars } from '../utils/env';
import { getGlobalConfig } from '../utils/global';
import { isMonoRepo } from '../utils/mono-repo';
import { config as app } from './app';

const globalDefinitionFilePath = path.resolve(srcDir, 'globals.d.ts');
const configFilePath = path.resolve(publicDir, 'config.js');

const { compileGlobalVars, runtimeGlobalVars, globalDefinitions, sharedGlobalDefinitions } = getGlobalConfig();

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

writeDefinitionFile(globalDefinitionFilePath, globalDefinitionsContent);

export const getRuntimeGlobalVarsContent = async () => {
  const prettierConfig = await prettier.resolveConfig(configFilePath);

  return prettier.format(formatGlobalVars(runtimeGlobalVars, 'js'), {
    ...prettierConfig,
    parser: 'babel',
  });
};

const isUnderMono = isMonoRepo(path.resolve(workDir, '../../'));

if (isUnderMono) {
  const monoRepoBaseDir = path.resolve(workDir, '../../');
  const sharedDir = path.resolve(monoRepoBaseDir, 'packages/shared');
  if (fs.existsSync(sharedDir)) {
    const sharedGlobalDefinitionFilePath = path.resolve(monoRepoBaseDir, sharedDir, 'globals.d.ts');
    writeDefinitionFile(sharedGlobalDefinitionFilePath, sharedGlobalDefinitionsContent);
  }
}

export default compileGlobalVars;
