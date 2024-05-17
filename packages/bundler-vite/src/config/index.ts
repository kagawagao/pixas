import { AppMode } from '@pixas/common';
import spaConfig from './spa';
import { UserConfig } from 'vite';

const configs: Partial<Record<AppMode, UserConfig>> = {
  spa: spaConfig,
};

export default configs;
