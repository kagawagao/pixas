import openBrowser from 'react-dev-utils/openBrowser';
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';

export function openBrowserWithConfig(host: string = 'localhost', port: number = 3000, isHttps: boolean = false) {
  const urls = prepareUrls(isHttps ? 'https' : 'http', host, port);
  openBrowser(urls.localUrlForBrowser);
}
