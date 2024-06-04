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
- 🚀 **Open API Support**: support generate request client code with open api spec, both v2 and v3, see [DTS](#dts)
- ⚙️ **Dynamic Configuration**: support dynamic configuration, see [Dynamic Configuration](#dynamic-runtime-configuration)

## Usage

### Installation

```bash
npm install -D @pixas/cli
```

**Note**: you need to install the corresponding bundler package, such as `@pixas/bundler-webpack`.

Currently Supported Bundlers:

- `webpack`

  ```bash
  npm install -D @pixas/bundler-webpack
  ```

- `vite`

  ```bash
  npm install -D @pixas/bundler-vite
  ```

### Usage

- start dev server

```bash
pixas dev
```

- build project

```bash
pixas build
```

- generate request client code

```bash
pixas dts
```

- generate specific environment configuration file

```bash
pixas env
```

### Configuration

`pixas` can run with zero configuration, but you can also configure it to meet your needs.

`pixas` use [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig) to load configuration, you can configure it in the following ways:

- `pixas.config.js`
- `pixas.config.ts`
- `pixas` field in `package.json`
- etc.

```js
export default {
  name: 'pixas',
};
```

You can use `defineConfig` to define the configuration with type checking and code completion:

```js
import { defineConfig } from '@pixas/cli';

export default defineConfig({
  name: 'pixas',
});
```

For typescript users, you can use `pixas.config.ts`:

```typescript
import { AppConfig } from '@pixas/cli';

const config: AppConfig = {
  name: 'pixas',
};

export default config;
```

#### Configuration Options

- `name`: project name
- `version`: project version
- `description`: project description
- `logo`: project logo image path, used in the html template and favicon
- `globals`: global environment variables, see [Dynamic Configuration](#dynamic-runtime-configuration)
- `bundler`: bundler to use, default is `webpack`
- `type`: project type, currently support `spa` only
- `dts`: dts configuration, see [DTS](#dts)

> All the configuration options are optional, you can use the default configuration.

## DTS

`pixas` support generate request client code with open api spec, both v2 and v3 are supported, it is based on [`opas`](https://github.com/kagawagao/opas), for more details, see [`opas`](https://github.com/kagawagao/opas), or you can use `opas` directly.

### Usage

```bash
pixas dts
```

### Output

the generated code will be output to the `src` directory, it contains follow modules:

- `apis`: request functions
- `interfaces`: request request and response type definitions
- `services`: request service for each module

### Configuration

```typescript
// pixas.config.ts

import { defineConfig } from '@pixas/cli';

export default defineConfig({
  dts: {
    modules: [
      {
        namespace: 'pet-store',
        url: 'https://petstore.swagger.io/v2/swagger.json',
      },
    ],
  },
});
```

#### Configuration Options

- `modules`: open api modules to generate, each module contains the following options:
  - `namespace`: module namespace
  - `url`: open api spec url
  - `basePath`: base path of the api, default extract from the open api spec
  - `extractField`: extract field from the response data, support `string` | `string[]`

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

`pixas` support configuration environment variables by using `.env` file. you can define the dynamic configuration in the `.env` file, and use it in your code. as the same usage as before, all the environment variables defined in the `.env` file will be injected into the `process.env` object, and we use prefix to distinguish the dynamic configuration from the static configuration, all the dynamic configuration will be prefixed with `APP_` and others are static configuration.

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

There are some internal environment variables that are always be treated as static configuration:

- `NODE_ENV`: node environment
- `APP_VERSION`: project version
- `BIZ_ENV`: business environment, such as `development`, `staging`, `production`, etc.
