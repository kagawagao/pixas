import { NodePath, PluginPass } from '@babel/core';
import { SourceLocation, StringLiteral } from '@babel/types';

export interface ExtractSymbols {
  single?: string[];
  multiple?: string[];
  components?: string[];
}

export type PermissionDescriptor = Record<string, any>;

export interface State extends PluginPass {
  permissions: ExtractedPermissionDescriptor[];
  componentNames: string[];
  functionNames: string[];
}

export type ExtractedPermissionDescriptor = PermissionDescriptor & Partial<SourceLocation> & { file?: string };

export type PermissionDescriptorPath = Record<keyof PermissionDescriptor, NodePath<StringLiteral> | undefined>;

export interface Options {
  symbols?: ExtractSymbols;
  properties?: string[];
  removeProperties?: string[];
  onPermissionExtracted?: (filePath: string, permissions: PermissionDescriptor[]) => void;
}

export interface PermissionPluginPass extends PluginPass {
  permissions: ExtractedPermissionDescriptor[];
  componentNames: string[];
  singleFunctionNames: string[];
  multipleFunctionNames: string[];
  props: string[];
  removeProps: string[];
}
