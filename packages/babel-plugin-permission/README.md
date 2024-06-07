# `@pixas/babel-plugin-permission`

> babel plugin for extract permission and remove permission code in production

## Install

```bash
npm install @pixas/babel-plugin-permission -D
```

## Usage

- remove permission code in production

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [['@pixas/babel-plugin-permission']],
};
```

- extract permission

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      '@pixas/babel-plugin-permission',
      {
        onPermissionExtracted: (filePath, permissions) => {
          console.log(permissions);
        },
      },
    ],
  ],
};
```

## Options

- `onPermissionExtracted` (optional): function to be called when permission extracted
- `properties` (optional): property names to extract permission
- `removeProperties` (optional): property names to remove from permission
- `symbols` (optional): symbol names to extract permission
  - `single` (optional): symbol names to extract permission from single symbol, default is `['definePermission']`
  - `multiple` (optional): symbol names to extract permission from multiple symbols, default is `['definePermissions']`
  - `components` (optional): symbol names to extract permission from components, default is `['UserPermissionAuthorize']`
