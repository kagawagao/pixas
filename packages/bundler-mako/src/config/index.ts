import { AppType } from '@pixas/common';
import { MakoConfig } from '../types';
import spaConfig from './spa';

const configs: Partial<Record<AppType, MakoConfig>> = {
  spa: spaConfig,
};

export default configs;
