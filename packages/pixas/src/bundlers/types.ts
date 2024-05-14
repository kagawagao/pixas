import { AppMode } from '../types';

export interface StartOptions {
  port?: number;
  host?: string;
  open?: boolean;
  mode?: AppMode;
}
