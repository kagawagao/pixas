import { PluginObj } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import babelPluginSyntaxJsx from '@babel/plugin-syntax-jsx';
import { ExtractedPermissionDescriptor, Options, PermissionPluginPass } from './types';
import { defaultSymbols } from './utils';
import { visitor as CallExpression } from './visitors/expression';
import { visitor as JSXOpeningElement } from './visitors/jsx';

export type ExtractionResult<M = Record<string, string>> = {
  permissions: ExtractedPermissionDescriptor[];
  meta: M;
};

export default declare<Options, PluginObj<PermissionPluginPass>>((api, options) => {
  api.assertVersion(7);
  const { onPermissionExtracted, symbols = defaultSymbols } = options;
  const componentNames = new Set<string>(...(symbols.components ?? []), defaultSymbols.components);
  const singleFunctionNames = new Set<string>(...(symbols.single ?? []), defaultSymbols.single);
  const multipleFunctionNames = new Set<string>(...(symbols.multiple ?? []), defaultSymbols.multiple);

  return {
    inherits: babelPluginSyntaxJsx,
    pre() {
      this.componentNames = Array.from(componentNames);
      this.singleFunctionNames = Array.from(singleFunctionNames);
      this.multipleFunctionNames = Array.from(multipleFunctionNames);
      this.permissions = [];
    },

    visitor: {
      Program: {
        exit(
          _,
          {
            file: {
              opts: { filename },
            },
          },
        ) {
          if (typeof onPermissionExtracted === 'function') {
            onPermissionExtracted(filename || '', this.permissions as any);
          }
        },
      },
      JSXOpeningElement,
      CallExpression,
    },
  };
});
