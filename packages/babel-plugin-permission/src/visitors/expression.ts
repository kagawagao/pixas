import { NodePath } from '@babel/core';
import { VisitNodeFunction } from '@babel/traverse';
import * as t from '@babel/types';
import { PermissionPluginPass } from '../types';
import {
  createPermissionDescriptor,
  evaluatePermissionDescriptor,
  storePermission,
  tagAsExtracted,
  wasExtracted,
} from '../utils';

function checkIsObjectExpression(path: NodePath<any>): boolean {
  if (!path || !path.isObjectExpression()) {
    return false;
  }
  return true;
}

function getPermissionsObjectFromExpression(nodePath: NodePath<any>): NodePath<any> {
  let currentPath = nodePath;
  while (
    t.isTSAsExpression(currentPath.node) ||
    t.isTSTypeAssertion(currentPath.node) ||
    t.isTypeCastExpression(currentPath.node)
  ) {
    currentPath = currentPath.get('expression') as NodePath<any>;
  }
  return currentPath;
}

export const visitor: VisitNodeFunction<PermissionPluginPass, t.CallExpression> = function (path) {
  if (wasExtracted(path)) {
    return;
  }
  const {
    permissions,
    singleFunctionNames,
    multipleFunctionNames,
    props: descriptorKeys,
    removeProps: shouldRemoveProperties,
  } = this;
  const callee = path.get('callee');
  const args = path.get('arguments');

  /**
   * Process PermissionDescriptor
   * @param permissionDescriptor Permission Descriptor
   */
  function processPermissionObject(permissionDescriptor: NodePath<t.ObjectExpression>) {
    const isObjectExpression = checkIsObjectExpression(permissionDescriptor);

    if (!isObjectExpression) {
      // skip if it's not an object expression
      tagAsExtracted(path);
      return;
    }

    const properties = permissionDescriptor.get('properties') as NodePath<t.ObjectProperty>[];

    const descriptorPath = createPermissionDescriptor(
      properties.map(
        (prop) => [prop.get('key'), prop.get('value')] as [NodePath<t.Identifier>, NodePath<t.StringLiteral>],
      ),
      descriptorKeys,
    );

    // Evaluate the Permission Descriptor values, then store it.
    const descriptor = evaluatePermissionDescriptor(descriptorPath, descriptorKeys);
    storePermission(descriptor, permissions);

    shouldRemoveProperties.forEach((name) => {
      const property = properties.find((prop) => {
        try {
          const keyProp = prop.get('key');
          return keyProp.isIdentifier({ name }) || keyProp.isStringLiteral({ value: name });
        } catch (error) {
          return false;
        }
      });
      property?.remove();
    });

    tagAsExtracted(path);
  }

  if (
    singleFunctionNames.some((name) => callee.isIdentifier({ name })) ||
    multipleFunctionNames.some((name) => callee.isIdentifier({ name }))
  ) {
    const firstArgument = args[0];
    const permissionsObj = getPermissionsObjectFromExpression(firstArgument);

    const isObjectExpression = checkIsObjectExpression(permissionsObj);
    if (!isObjectExpression) {
      // skip if it's not an object expression
      tagAsExtracted(path);
      return;
    }
    if (singleFunctionNames.some((name) => callee.isIdentifier({ name }))) {
      processPermissionObject(permissionsObj as NodePath<t.ObjectExpression>);
    } else {
      const properties = permissionsObj.get('properties');
      if (Array.isArray(properties)) {
        properties.map((prop) => prop.get('value') as NodePath<t.ObjectExpression>).forEach(processPermissionObject);
      }
    }
  }
};
