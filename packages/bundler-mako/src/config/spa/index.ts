import { paths } from '@pixas/common';
import { MakoConfig } from '../../types';

const { entryPath, outputDir, publicDir } = paths;

const config: MakoConfig = {
  mode: process.env.NODE_ENV as 'development' | 'production',
  publicPath: process.env.PUBLIC_PATH,
  copy: [publicDir],
  clean: true,
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css', '.less'],
    alias: [['@', 'src']],
  },
  entry: {
    index: entryPath,
  },
  output: {
    path: outputDir,
    mode: 'bundle',
    preserveModules: false,
  },
};

export default config;
