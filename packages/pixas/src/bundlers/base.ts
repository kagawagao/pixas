export interface IBundler {
  dev: () => Promise<void>;
  build: () => Promise<void>;
}

export default abstract class BaseBundler implements IBundler {
  constructor() {
    console.log('base bundler');
  }

  /**
   * Start a development server
   */
  public abstract dev(): Promise<void>;

  /**
   * Build the project
   */
  public abstract build(): Promise<void>;
}
