import { loadEnv } from './base';

loadEnv();

// always `development` for develop
process.env.NODE_ENV = 'development';
