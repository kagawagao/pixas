import fs from 'fs';
import { tsConfigPath } from '../configs/paths';

export const supportTypeScript = fs.existsSync(tsConfigPath);
