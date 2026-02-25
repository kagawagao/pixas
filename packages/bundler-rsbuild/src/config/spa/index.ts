import { RsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginLess } from '@rsbuild/plugin-less';
import { paths, framework, global } from '@pixas/common';

const { entryPath, outputDir, srcDir } = paths;

const basePlugins =
  framework.framework === 'react' ? [pluginReact()] : framework.framework === 'vue' ? [pluginVue()] : [];

const config: RsbuildConfig = {
  source: {
    entry: {
      index: entryPath,
    },
    define: global.getGlobalConfig().compileGlobalVars,
    alias: {
      '@': srcDir,
    },
  },
  output: {
    distPath: {
      root: outputDir,
    },
    assetPrefix: process.env.PUBLIC_PATH,
    cleanDistPath: true,
  },
  html: {
    tags: [
      {
        tag: 'script',
        attrs: {
          type: 'text/javascript',
          src: `${process.env.PUBLIC_PATH ?? ''}/config.js`,
        },
        head: true,
        append: false,
      },
    ],
  },
  plugins: [...basePlugins, pluginLess()],
};

export default config;
