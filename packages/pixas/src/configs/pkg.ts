import { readJSONFileSync } from '../utils/read-json';
import { pkgPath } from './paths';

export const pkg = readJSONFileSync(pkgPath);

export default pkg;
