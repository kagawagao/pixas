import { AppConfig } from '../types';
import { StartOptions } from './types';

export interface IBundler {
  start: (options?: StartOptions) => Promise<void> | void;
  build: () => Promise<void> | void;
}

export default abstract class BaseBundler implements IBundler {
  public app = {} as AppConfig;
  constructor(app: AppConfig) {
    this.app = app;
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
