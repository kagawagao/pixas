import { AppType } from '@pixas/common';
import { UserConfig } from 'vite';
import spaConfig from './spa';

const configs: Partial<Record<AppType, UserConfig>> = {
  spa: spaConfig,
};

export default configs;
