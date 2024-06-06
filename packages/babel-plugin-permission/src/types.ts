import { NodePath, PluginPass } from '@babel/core';
import { SourceLocation, StringLiteral } from '@babel/types';

export interface ExtractSymbols {
  single?: string[];
  multiple?: string[];
  components?: string[];
}

export enum PermissionType {
  MENU = 'MENU',
  OPERATE = 'OPERATE',
}

export interface FullUri {
  uri: string;
  method: string;
}

export type Uri = string | FullUri;

export interface PermissionDescriptor {
  /**
   * 权限标识
   */
  id: string;
  /**
   * 权限名称
   */
  name: string;
  /**
   * 权限值
   */
  value?: string;
  /**
   * 父权限标识
   */
  parent?: string;
  /**
   * 权限类型
   */
  type?: PermissionType;
  /**
   * 权限描述
   */
  description?: string;
  /**
   * 权限分组
   */
  groups?: string[];
  /**
   * 扩展字段
   */
  data?: any;
  /**
   * 对应uri集合
   */
  uris?: Uri[];
}

export interface State extends PluginPass {
  permissions: ExtractedPermissionDescriptor[];
  componentNames: string[];
  functionNames: string[];
}

export type ExtractedPermissionDescriptor = PermissionDescriptor & Partial<SourceLocation> & { file?: string };

export type PermissionDescriptorPath = Record<keyof PermissionDescriptor, NodePath<StringLiteral> | undefined>;

export interface Options {
  onPermissionExtracted?: (filePath: string, permissions: PermissionDescriptor[]) => void;
  symbols?: ExtractSymbols;
}

export interface PermissionPluginPass extends PluginPass {
  permissions: ExtractedPermissionDescriptor[];
  componentNames: string[];
  singleFunctionNames: string[];
  multipleFunctionNames: string[];
}
