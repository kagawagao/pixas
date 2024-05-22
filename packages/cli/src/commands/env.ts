import { GlobalVarFormat, env, global, paths } from '@pixas/common';
import { program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import prettier, { BuiltInParserName } from 'prettier';

interface Options {
  env: string;
  format: GlobalVarFormat;
  out: string;
}

const defaultOut = 'console';
const defaultFormat = 'json';

/**
 * Usage
 */
program
  .usage('<options>')
  .description('Generate env file config')
  .option('-e, --env <env>', 'env file')
  .option('-f, --format <format>', 'generate content type, current support: js,json', defaultFormat)
  .option('-o, --out <out>', 'file generation location', defaultOut)
  .parse(process.argv)
  .action(async () => {
    const options = program.opts() as Options;

    const configOutputConfig: Record<GlobalVarFormat, { file: string; parser: BuiltInParserName }> = {
      json: {
        file: path.resolve(paths.publicDir, 'config.json'),
        parser: 'json',
      },
      js: {
        file: path.resolve(paths.publicDir, 'config.js'),
        parser: 'babel',
      },
    };
    const { env: currentEnv, format, out } = options;
    process.env.BIZ_ENV = currentEnv;
    env.loadEnv(true);
    const { runtimeGlobalVars } = global.getGlobalConfig();
    const configContent = env.formatGlobalVars(runtimeGlobalVars, format);

    if (out === 'console') {
      console.log(configContent);
    } else {
      const { file, parser } = configOutputConfig[format];

      const prettierConfig = await prettier.resolveConfig(file);

      const formattedContent = await prettier.format(configContent, {
        ...prettierConfig,
        parser,
      });

      fs.writeFileSync(file, formattedContent, {
        encoding: 'utf-8',
      });
    }
  });
