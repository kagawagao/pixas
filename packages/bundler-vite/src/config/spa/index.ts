import { defineConfig, normalizePath } from 'vite';
import fs from 'fs-extra';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { paths, framework, global, postcss } from '@pixas/common';

const { entryPath, outputDir, publicDir, srcDir, workDir } = paths;

const basePlugins = framework.framework === 'react' ? [react()] : framework.framework.includes('vue') ? [vue()] : [];

const config = defineConfig({
  mode: process.env.BIZ_ENV,
  // disable env file to avoid conflict with globals config
  root: workDir,
  base: process.env.PUBLIC_PATH,
  publicDir,
  appType: 'spa',
  define: global.getGlobalConfig().compileGlobalVars,
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.css', '.less'],
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main'],
    alias: {
      '@': srcDir,
      lodash: 'lodash-es',
    },
  },
  css: {
    postcss: postcss.config,
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [
    ...basePlugins,
    {
      name: 'vite-plugin-html',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => {
          return {
            html,
            tags: [
              {
                tag: 'script',
                attrs: {
                  type: 'text/javascript',
                  src: normalizePath(`${process.env.PUBLIC_PATH ?? ''}/config.js`),
                },
              },
              {
                tag: 'script',
                attrs: {
                  type: 'module',
                  src: entryPath,
                },
              },
            ],
          };
        },
      },
    },
    {
      name: 'vite-plugin-dynamic-config',
      enforce: 'pre',
      buildStart: async () => {
        const content = await global.getRuntimeGlobalVarsContent();

        await fs.ensureDir(publicDir);

        fs.writeFileSync(`${publicDir}/config.js`, content);
      },
    },
  ],
  build: {
    outDir: outputDir,
    assetsDir: '',
    emptyOutDir: true,
  },
});

export default config;
