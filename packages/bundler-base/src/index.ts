import { AppConfig, AppFramework, AppMode, app } from '@pixas/common';
import { IBundler, StartOptions } from './types';
export * from './types';

export default abstract class Bundler implements IBundler {
  public app: AppConfig;
  public mode: AppMode;
  public framework: AppFramework;
  constructor() {
    this.app = app.config;
    this.mode = app.config.mode || 'spa';
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
