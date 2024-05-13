import { declare } from '@babel/helper-plugin-utils';

module.exports = declare((api, options) => {
  api.assertVersion(7);

  const isNode = api.caller((caller) => {
    if (caller?.name === 'babel-loader') {
      return (caller as any).target === 'node';
    }
    return false;
  });

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: false, // close this to make tree-shaking work
          useBuiltIns: 'usage',
          corejs: 3,
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
    env: {
      development: {
        plugins: [
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: false,
            },
            'antd',
          ],
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'lodash',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'lodash',
          ],
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'lodash-es',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'lodash-es',
          ],
          [
            require.resolve('@babel/plugin-transform-runtime'),
            {
              useESModules: true,
            },
          ],
          !isNode && require.resolve('react-refresh/babel'),
        ].filter(Boolean),
      },
      test: {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              useBuiltIns: 'usage',
              corejs: 3,
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
          [require.resolve('babel-plugin-import'), false, 'antd'],
          [require.resolve('babel-plugin-import'), false, 'wau'],
          require.resolve('@babel/plugin-transform-runtime'),
        ],
      },
      production: {
        plugins: [
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: false,
            },
            'antd',
          ],
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'antd-mobile',
              libraryDirectory: 'es',
              style: false,
            },
            'antd-mobile',
          ],
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'lodash',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'lodash',
          ],
          [
            require.resolve('babel-plugin-import'),
            {
              libraryName: 'lodash-es',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'lodash-es',
          ],
          [
            require.resolve('@babel/plugin-transform-runtime'),
            {
              useESModules: true,
            },
          ],
        ],
      },
    },
  } as any;
});
