import { transformFileSync } from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';
import plugin from '../src';
import { ExtractedPermissionDescriptor, Options } from '../src/types';

let cacheBust = 1;

function transform(filePath: string, options: Options = {}, { multiplePasses = false } = {}) {
  function getPluginConfig() {
    return [plugin, options, Date.now() + '' + ++cacheBust];
  }

  return transformFileSync(filePath, {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '14',
            esmodules: true,
          },
          modules: false,
          useBuiltIns: false,
          ignoreBrowserslistConfig: true,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: multiplePasses ? [getPluginConfig(), getPluginConfig()] : [getPluginConfig()],
  });
}

function transformAndCheck(fn: string, opts: Options = {}) {
  const tsxFilePath = path.join(__dirname, 'fixtures', `${fn}/index.tsx`);
  const tsFilePath = path.join(__dirname, 'fixtures', `${fn}/index.ts`);
  const filePath = fs.existsSync(tsxFilePath) ? tsxFilePath : tsFilePath;
  const permissions: ExtractedPermissionDescriptor[] = [];

  const transformed = transform(filePath, {
    ...opts,
    onPermissionExtracted(_, items) {
      permissions.push(...items);
    },
  });
  if (transformed) {
    const { code } = transformed;
    expect({
      data: { permissions },
      code: code?.trim(),
    });
  }
}

describe('babel-plugin-user-permission', () => {
  test('UserPermissionAuthorize', function () {
    transformAndCheck('UserPermissionAuthorize');
  });

  test('definePermission', function () {
    transformAndCheck('definePermission');
  });

  test('definePermissions', function () {
    transformAndCheck('definePermissions');
  });

  test('CustomUserPermissionAuthorize', function () {
    transformAndCheck('CustomUserPermissionAuthorize', {
      symbols: {
        components: ['CustomUserPermissionAuthorize'],
      },
    });
  });

  test('customDefinePermission', function () {
    transformAndCheck('customDefinePermission', {
      symbols: {
        single: ['customDefinePermission'],
      },
    });
  });

  test('customDefinePermissions', function () {
    transformAndCheck('customDefinePermissions', {
      symbols: {
        multiple: ['customDefinePermissions'],
      },
    });
  });
});
