import BaseBundler from '../base';

export default class WebpackBundler extends BaseBundler {
  constructor() {
    super();
    console.log('webpack bundler');
  }

  public dev(): Promise<void> {
    return Promise.resolve();
  }

  public build(): Promise<void> {
    return Promise.resolve();
  }
}
