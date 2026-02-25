import { AppType } from '@pixas/common';
import { RsbuildConfig } from '@rsbuild/core';
import spaConfig from './spa';

const configs: Partial<Record<AppType, RsbuildConfig>> = {
  spa: spaConfig,
};

export default configs;
