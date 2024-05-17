import { readJSONFileSync } from '../utils/json';
import { pkgPath } from './paths';

export const pkg = readJSONFileSync(pkgPath);

export default pkg;
