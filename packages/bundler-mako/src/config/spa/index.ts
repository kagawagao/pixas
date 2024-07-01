import { paths } from '@pixas/common';
import { srcDir } from '@pixas/common/lib/configs/paths';
import { MakoConfig } from '../../types';

const { entryPath, outputDir, publicDir } = paths;

const config: MakoConfig = {
  mode: process.env.NODE_ENV as 'development' | 'production',
  publicPath: process.env.PUBLIC_PATH,
  copy: [publicDir],
  clean: true,
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css', '.less'],
    alias: [['@', srcDir]],
  },
  entry: {
    index: entryPath,
  },
  output: {
    path: outputDir,
    mode: 'bundle',
    preserveModules: false,
  },
  moduleIdStrategy: process.env.NODE_ENV === 'production' ? 'hashed' : 'named',
};

export default config;
