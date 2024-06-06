import { NodePath } from '@babel/core';
import { VisitNodeFunction } from '@babel/traverse';
import * as t from '@babel/types';
import { PermissionPluginPass } from '../types';
import {
  createPermissionDescriptor,
  evaluatePermissionDescriptor,
  getPermissionDescriptorKey,
  shouldRemoveProperties,
  storePermission,
  tagAsExtracted,
  wasExtracted,
} from '../utils';

export const visitor: VisitNodeFunction<PermissionPluginPass, t.JSXOpeningElement> = function (path) {
  const { componentNames, permissions } = this;
  if (wasExtracted(path)) {
    return;
  }

  const name = path.get('name');

  if (!componentNames.find((n: string) => name.isJSXIdentifier({ name: n }))) {
    return;
  }

  const attributes = path.get('attributes').filter((attr) => attr.isJSXAttribute());

  if (attributes.length) {
    const descriptorPath = createPermissionDescriptor(
      attributes.map((attr) => [
        attr.get('name') as NodePath<t.JSXIdentifier>,
        attr.get('value') as NodePath<t.StringLiteral>,
      ]),
    );

    // Evaluate the Permission Descriptor values in a JSX
    // context, then store it.
    const descriptor = evaluatePermissionDescriptor(descriptorPath);

    if (!descriptor.id && !descriptor.name) {
      // pass through
      return;
    }

    storePermission(descriptor, path, permissions);

    // remove extra properties
    for (const attr of attributes) {
      if (!attr.isJSXAttribute()) {
        continue;
      }
      const name = getPermissionDescriptorKey((attr as NodePath<t.JSXAttribute>).get('name'));
      if (shouldRemoveProperties.includes(name)) {
        attr.remove();
      }
    }
  }

  // Tag the AST node so we don't try to extract it twice.
  tagAsExtracted(path);
};
