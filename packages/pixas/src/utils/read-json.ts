import fs from 'node:fs';
import { promisify } from 'node:util';

/**
 * read json file
 * @param file file path
 * @returns json object
 */
export const readJSONFile = async (file: string) => {
  if (!file) {
    throw new Error('Invalid File Path');
  }

  const fileContent = await promisify(fs.readFile)(file, 'utf8');
  if (!fileContent) {
    return {};
  }
  const data = JSON.parse(fileContent);
  return data;
};

/**
 * read json file sync
 * @param file file path
 * @returns json object
 */
export const readJSONFileSync = (file: string): Record<string, any> => {
  if (!file) {
    throw new Error('Invalid File Path');
  }
  return require(file);
  // const fileContent = fs.readFileSync(file, 'utf8')
  // return JSON.parse(fileContent)
};
