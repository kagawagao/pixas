import fs from 'fs';
import path from 'path';
import { workDir } from '../configs/paths';
import { readJSONFileSync } from './json';

const supportedMonoRepoFiles = ['turbo.json', 'lerna.json', 'rush.json', 'pnpm-workspace.yaml'];

/**
 * check if the project is a monorepo
 * @param baseDir base directory, generally the working directory of the project
 */
export function isMonoRepo(baseDir = workDir) {
  const rootPkg = path.resolve(baseDir, 'package.json');
  // check package.json workspaces config firstly
  if (fs.existsSync(rootPkg)) {
    const pkg = readJSONFileSync(rootPkg);
    if (pkg.workspaces) {
      return true;
    }
  }
  // check mono repo config files
  const isThirdMonoRepo = supportedMonoRepoFiles.some((file) => fs.existsSync(path.resolve(baseDir, file)));

  return isThirdMonoRepo;
}
