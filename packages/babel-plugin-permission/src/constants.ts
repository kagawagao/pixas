import { ExtractSymbols } from './types';

/**
 * Default symbols to look for in the code.
 */
export const defaultSymbols: ExtractSymbols = {
  single: ['definePermission'],
  multiple: ['definePermissions'],
  components: ['UserPermissionAuthorize'],
};

/**
 * Default properties to extract from the permission descriptor.
 */
export const defaultProps = ['code', 'name', 'value', 'description', 'parent', 'type', 'groups', 'data', 'uris'];

/**
 * Properties that should be removed from the permission descriptor.
 */
export const defaultRemoveProps = ['name', 'value', 'description', 'parent', 'type', 'groups', 'data', 'uris'];

/**
 * Symbol used to mark a permission as extracted.
 */
export const extractedSymbol = Symbol('UserPermissionExtracted');
