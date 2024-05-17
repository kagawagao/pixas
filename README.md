# Pixas

[![build](https://github.com/kagawagao/pixas/actions/workflows/build.yml/badge.svg)](https://github.com/kagawagao/pixas/actions/workflows/build.yml)
[![CodeQL](https://github.com/kagawagao/pixas/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/kagawagao/pixas/actions/workflows/codeql-analysis.yml)

front end develop toolkit, which support multi bundler(ex: webpack/vite/...) and multi framework(ex: react/vue/...)

> **Note**: This project is still under development, and is not ready for production use.

## Features

- 📦 **Multi Bundler Support**
  - [x] webpack
  - [x] vite
- 🛠 **Multi Framework Support**
  - [x] react
  - [x] vue
- ⚙️ **Dynamic Configuration**: support dynamic configuration, see [Dynamic Configuration](#dynamic-runtime-configuration)

## Dynamic Configuration

### Motivation

consider the following scenario:

1. you have a project which contains multiple runtime configurations, such as `development`, `staging`, `production`, etc.
2. if you want to switch the runtime configuration, you need to rebuild the project, which is not convenient.
3. you want to switch the runtime configuration at runtime or just restart, without rebuilding the project.

### Solution

`pixas` provides a solution to this problem, which is to support dynamic configuration at runtime.

we split the configuration into two parts:

- `static configuration`: the configuration that is determined at build time, such as `NODE_ENV`, `APP_VERSION`, etc.

- `dynamic configuration`: the configuration that is determined at runtime, such as `APP_NAME` and what we want to make dynamic.

### How it works

`pixas` support configuration environment variables by using `env` file. you can define the dynamic configuration in the `.env` file, and use it in your code. as the same usage as before, all the environment variables defined in the `.env` file will be injected into the `process.env` object, and we use prefix to distinguish the dynamic configuration from the static configuration, all the dynamic configuration will be prefixed with `APP_` and others are static configuration.

For example:

```properties
# .env

# static configuration
NODE_ENV=development
APP_VERSION=1.0.0

# dynamic configuration
APP_NAME=pixas
```

```javascript
// src/index.js

console.log(process.env.NODE_ENV); // development
console.log(process.env.APP_VERSION); // 1.0.0
console.log(process.env.APP_NAME); // pixas
```

In addition to the above methods, you can also explicitly configure it in `pixas.config.ts`

```typescript
// pixas.config.ts

export default {
  globals: {
    compile: ['NODE_ENV', 'APP_VERSION'],
    runtime: ['APP_NAME'],
  },
};
```
