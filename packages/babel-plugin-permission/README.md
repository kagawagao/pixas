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
