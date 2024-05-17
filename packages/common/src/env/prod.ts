import { loadEnv } from './base';

loadEnv();

// always `production` for build
process.env.NODE_ENV = 'production';
