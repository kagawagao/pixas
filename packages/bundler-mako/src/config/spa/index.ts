import { global, paths } from '@pixas/common';
import { MakoConfig } from '../../types';

const { entryPath, outputDir, publicDir } = paths;

const config: MakoConfig = {
  mode: process.env.NODE_ENV as 'development' | 'production',
  publicPath: process.env.PUBLIC_PATH,
  copy: [publicDir],
  clean: true,
  define: Object.entries(global.getGlobalConfig().compileGlobalVars).reduce(
    (acc, [key, value]) => {
      acc[key.replace('process.env', '')] = value;
      return acc;
    },
    {} as Record<string, any>,
  ),
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css', '.less'],
    alias: [['@', 'src']],
  },
  entry: {
    app: entryPath,
  },
  output: {
    path: outputDir,
    mode: 'bundle',
    preserveModules: false,
  },
};

export default config;
