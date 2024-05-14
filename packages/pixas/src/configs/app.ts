import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';
import { AppConfig } from '../types';
import pkg from './pkg';

const MODULE_NAME = 'pixas';

const defaultAppConfig: AppConfig = {
  name: pkg.name,
  description: pkg.description,
  version: (process.env.APP_VERSION || pkg.version).trim(),
  mode: 'spa',
};

export const explorer = cosmiconfig(MODULE_NAME);

export const load = async (): Promise<AppConfig> => {
  const result = await explorer.search();
  return {
    ...defaultAppConfig,
    ...result?.config,
  };
};

export const config: AppConfig = {
  ...defaultAppConfig,
  ...cosmiconfigSync(MODULE_NAME).search()?.config,
};
