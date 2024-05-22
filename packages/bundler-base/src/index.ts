import { AppConfig, AppFramework, AppType, app } from '@pixas/common';
import { IBundler, StartOptions } from './types';
export * from './types';

export default abstract class Bundler implements IBundler {
  public app: AppConfig;
  public type: AppType;
  public framework: AppFramework;
  constructor() {
    this.app = app.config;
    this.type = app.config.type || 'spa';
    this.framework = app.config.framework || 'react';
  }

  /**
   * Start a development server
   */
  public abstract start(options?: StartOptions): Promise<void> | void;

  /**
   * Build the project
   */
  public abstract build(): Promise<void> | void;
}
