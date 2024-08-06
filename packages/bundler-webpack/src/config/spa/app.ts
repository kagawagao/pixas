import { existsSync } from 'fs';
import { webpackConfigPaths } from '../../constants';

export const appConfig = (() => {
  let webpackPath = '';

  for (let i = 0; i < webpackConfigPaths.length; i++) {
    const filePath = webpackConfigPaths[i];
    if (existsSync(filePath)) {
      webpackPath = filePath;
      break;
    }
  }
  if (webpackPath) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const appConfig = require(webpackPath);
    return appConfig.default || appConfig;
  } else {
    return {};
  }
})();
