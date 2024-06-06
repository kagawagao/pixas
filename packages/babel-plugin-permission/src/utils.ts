import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import {
  ExtractedPermissionDescriptor,
  ExtractSymbols,
  PermissionDescriptor,
  PermissionDescriptorPath,
  PermissionType,
} from './types';

/**
 * Default symbols to look for in the code.
 */
export const defaultSymbols: ExtractSymbols = {
  single: ['definePermission'],
  multiple: ['definePermissions'],
  components: ['UserPermissionAuthorize'],
};

export const DESCRIPTOR_PROPS: (keyof PermissionDescriptorPath)[] = [
  'id',
  'name',
  'value',
  'description',
  'parent',
  'type',
  'groups',
  'data',
  'uris',
];

const EXTRACTED = Symbol('UserPermissionExtracted');

export const shouldRemoveProperties = ['name', 'value', 'description', 'parent', 'type', 'groups', 'data', 'uris'];

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
): PermissionDescriptorPath {
  return propPaths.reduce(
    (hash: PermissionDescriptorPath, [keyPath, valuePath]) => {
      const key = getPermissionDescriptorKey(keyPath) as keyof PermissionDescriptorPath;

      if (DESCRIPTOR_PROPS.includes(key)) {
        hash[key as keyof PermissionDescriptor] = valuePath as NodePath<t.StringLiteral>;
      }

      return hash;
    },
    {
      id: undefined,
      name: undefined,
      value: undefined,
      description: undefined,
      type: undefined,
      parent: undefined,
      data: undefined,
      groups: undefined,
      uris: undefined,
    },
  );
}

export function evaluatePermissionDescriptor(descriptorPath: PermissionDescriptorPath) {
  const descriptor: Partial<PermissionDescriptor> = {};

  DESCRIPTOR_PROPS.forEach((key) => {
    const value = getPermissionDescriptorValue(descriptorPath[key]);

    descriptor[key] = value;
  });

  if (!descriptor.type) {
    descriptor.type = 'OPERATE' as PermissionType;
  }

  if (!descriptor.groups) {
    descriptor.groups = [];
  }

  if (!descriptor.uris) {
    descriptor.uris = [];
  } else {
    descriptor.uris = descriptor.uris.map((item) => {
      if (typeof item === 'string') {
        return {
          uri: item,
          method: 'GET',
        };
      } else {
        return {
          ...item,
          method: item.method.toUpperCase(),
        };
      }
    });
  }

  return descriptor as PermissionDescriptor;
}

export function tagAsExtracted(path: NodePath<any>) {
  path.node[EXTRACTED] = true;
}

export function wasExtracted(path: NodePath<any>) {
  return !!path.node[EXTRACTED];
}

export function storePermission(
  permissionDescriptor: PermissionDescriptor,
  path: NodePath<any>,
  permissions: ExtractedPermissionDescriptor[],
) {
  if (!permissionDescriptor.id) {
    throw path.buildCodeFrameError('[User Permission] Permission Descriptors require an `id`.');
  }
  permissions.push(permissionDescriptor);
}
