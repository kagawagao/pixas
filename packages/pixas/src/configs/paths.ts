import fs from 'node:fs';
import path from 'node:path';

/**
 * working directory
 */
export const workDir = process.cwd();

/**
 * source directory
 */
export const srcDir = path.resolve(workDir, 'src');

/**
 * mocks directory
 */
export const mockDir = path.resolve(workDir, 'mocks');

/**
 * public source directory
 */
export const publicDir = path.resolve(workDir, 'public');

/**
 * build output directory
 */
export const outputDir = path.resolve(workDir, 'build');

/**
 * package.json path
 */
export const pkgPath = path.resolve(workDir, 'package.json');

/**
 * html template path
 */
export const tplPath = (() => {
  let tpl = path.resolve(publicDir, 'index.ejs'); // default

  // compatible with each version
  if (fs.existsSync(path.resolve(srcDir, 'index.ejs'))) {
    tpl = path.resolve(srcDir, 'index.ejs');
  } else if (fs.existsSync(path.resolve(publicDir, 'index.ejs'))) {
    tpl = path.resolve(publicDir, 'index.ejs');
  } else {
    tpl = path.resolve(__dirname, '../../index.ejs');
  }
  return tpl;
})();

/**
 * possible entry paths
 */
export const entryPaths = [
  'main.ts',
  'main.tsx',
  'main.js',
  'main.jsx',
  'index.ts',
  'index.tsx',
  'index.js',
  'index.jsx',
  'app.ts',
  'app.tsx',
  'app.js',
  'app.jsx',
].map((file) => path.resolve(srcDir, file));

const existEntryPaths = entryPaths.filter((file) => fs.existsSync(file));

/**
 * real entry path
 */
export const entryPath = existEntryPaths[0];

/**
 * ts config path
 */
export const tsConfigPath = path.resolve(workDir, 'tsconfig.json');
