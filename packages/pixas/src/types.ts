/**
 * app runtime mode
 */
export type AppMode = 'spa' | 'ssr' | 'ssg';

/**
 * app bundler
 */
export type AppBundler = 'webpack' | 'vite';

/**
 * global var format
 */
export type GlobalVarFormat = 'json' | 'js';

/**
 * global var config
 */
export interface GlobalConfig {
  /**
   * global vars used in compile time
   */
  compile?: string[];
  /**
   * global vars used in runtime
   */
  runtime?: string[];
}

/**
 * app config
 */
export interface AppConfig {
  /**
   * app mode
   * @default spa
   */
  mode?: AppMode;
  /**
   * app bundler
   * @default webpack
   */
  bundler?: AppBundler;
  /**
   * app name
   * @default package.ame
   */
  name?: string;
  /**
   * app version
   * @default package.version
   */
  version?: string;
  /**
   * app description
   * @default package.description
   */
  description?: string;
  /**
   * app logo, used to generate favicon
   */
  logo?: string;
  /**
   * global vars
   * @default ["NODE_ENV", "APP_NAME", "APP_VERSION"]
   */
  globals?: string[] | GlobalConfig;
  /**
   * is monorepo
   */
  isMono?: boolean;
  /**
   * dts config
   */
  dts?: DtsConfig;
  [k: string]: any;
}

export interface DtsModule {
  /**
   * open api spec url, support local file path
   */
  url: string;
  /**
   * namespace
   */
  namespace: string;
  /**
   * base path
   * if not set, use base path from open api spec
   */
  basePath?: string;
  /**
   * extract field from response data
   * @example 'data'
   */
  extractField?: string | string[];
}
export interface DtsConfig {
  /**
   */
  modules: DtsModule[];
}
