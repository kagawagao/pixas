import { GlobalVarFormat } from '../types';

/**
 * global vars formatter
 */
const formatters: Record<GlobalVarFormat, (globalVars: Record<string, any>) => string> = {
  json: (globalVars: Record<string, any>) => {
    return JSON.stringify(globalVars, null, 2);
  },
  js: (globalVars: Record<string, any>) => {
    return `window.process = ${JSON.stringify(globalVars, null, 2)}`;
  },
};

/**
 * format global vars
 * @param globalVars global variables
 * @param format format
 * @returns
 */
export const formatGlobalVars = (globalVars: Record<string, any>, format: GlobalVarFormat) => {
  return formatters[format]({
    env: globalVars,
  });
};
