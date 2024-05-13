import { program } from 'commander';

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-i, --ip [ip]', 'host to use')
  .option('-p, --port [port]', 'port to use')
  .option('-b, --bundler [bundler]', 'bundler to use', 'webpack')
  .parse(process.argv);
