import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import { extractedSymbol } from './constants';
import { ExtractedPermissionDescriptor, PermissionDescriptor, PermissionDescriptorPath } from './types';

function evaluatePath(path: NodePath<any>): string {
  const evaluated = path.evaluate();
  if (evaluated.confident) {
    return evaluated.value;
  }

  throw path.buildCodeFrameError('[User Permission] Permissions must be statically evaluate-able for extraction.');
}

export function getPermissionDescriptorKey(path: NodePath<any>) {
  if (path.isIdentifier() || path.isJSXIdentifier()) {
    return path.node.name;
  }

  return evaluatePath(path);
}

function getPermissionDescriptorValue(
  path?: NodePath<t.StringLiteral> | NodePath<t.JSXExpressionContainer> | NodePath<t.TemplateLiteral>,
) {
  if (!path) {
    return '';
  }
  if (path.isJSXExpressionContainer()) {
    path = path.get('expression') as NodePath<t.StringLiteral>;
  }

  // Always trim the Permission Descriptor values.
  const descriptorValue = evaluatePath(path);

  return descriptorValue;
}

export function createPermissionDescriptor(
  propPaths: [
    NodePath<t.JSXIdentifier> | NodePath<t.Identifier>,
    NodePath<t.StringLiteral> | NodePath<t.JSXExpressionContainer>,
  ][],
  properties: string[],
): PermissionDescriptorPath {
  const defaultDescriptor = Object.keys(properties).reduce((prev, cur) => {
    prev[cur] = undefined;
    return prev;
  }, {});
  return propPaths.reduce((hash: PermissionDescriptorPath, [keyPath, valuePath]) => {
    const key = getPermissionDescriptorKey(keyPath) as keyof PermissionDescriptorPath;

    if (properties.includes(key)) {
      hash[key as keyof PermissionDescriptor] = valuePath as NodePath<t.StringLiteral>;
    }

    return hash;
  }, defaultDescriptor);
}

export function evaluatePermissionDescriptor(descriptorPath: PermissionDescriptorPath, properties: string[]) {
  const descriptor: Partial<PermissionDescriptor> = {};

  properties.forEach((key) => {
    const value = getPermissionDescriptorValue(descriptorPath[key]);

    descriptor[key] = typeof value === 'string' ? value.trim() : value;
  });

  return descriptor;
}

export function tagAsExtracted(path: NodePath<any>) {
  path.node[extractedSymbol] = true;
}

export function wasExtracted(path: NodePath<any>) {
  return !!path.node[extractedSymbol];
}

export function storePermission(
  permissionDescriptor: PermissionDescriptor,
  permissions: ExtractedPermissionDescriptor[],
) {
  permissions.push(permissionDescriptor);
}
