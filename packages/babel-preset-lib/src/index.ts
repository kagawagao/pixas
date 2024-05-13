import { declare } from '@babel/helper-plugin-utils';

const targets = {
  chrome: 62,
  // ie: 11,
  node: 16,
};

module.exports = declare((api, options) => {
  api.assertVersion(7);
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          modules: false,
          corejs: 3,
          targets,
          ...options,
        },
      ],
      require.resolve('@babel/preset-typescript'),
      [
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          useESModules: true,
        },
      ],
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
        'antd',
      ],
    ],
    env: {
      commonjs: {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              useBuiltIns: 'usage',
              corejs: 3,
              targets,
              ...options,
            },
          ],
          require.resolve('@babel/preset-typescript'),
          [
            require.resolve('@babel/preset-react'),
            {
              runtime: 'automatic',
            },
          ],
        ],
        plugins: [
          [require.resolve('@babel/plugin-transform-runtime')],
          [
            'import',
            {
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: true,
            },
            'antd',
          ],
        ],
      },
      test: {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              useBuiltIns: 'usage',
              corejs: 3,
              targets,
              ...options,
            },
          ],
          require.resolve('@babel/preset-typescript'),
          [
            require.resolve('@babel/preset-react'),
            {
              runtime: 'automatic',
            },
          ],
        ],
        plugins: [
          [require.resolve('@babel/plugin-transform-runtime')],
          [
            'import',
            {
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: false,
            },
            'antd',
          ],
        ],
      },
    },
  } as any;
});
