import { Config } from 'stylelint';

const stylelintConfig: Config = {
  extends: [require.resolve('stylelint-config-standard'), require.resolve('stylelint-prettier/recommended')],
  plugins: [require.resolve('stylelint-prettier')],
  rules: {
    'prettier/prettier': true,
    'function-name-case': null,
    'function-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    'import-notation': null,
    'media-feature-range-notation': 'prefix',
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.vue', '**/*.html'],
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      customSyntax: require('postcss-html')({
        less: 'postcss-less',
        scss: 'postcss-scss',
      }),
    },
    {
      files: ['**/*.md'],
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      customSyntax: require('postcss-markdown')({
        less: 'postcss-less',
        scss: 'postcss-scss',
      }),
    },
    // {
    //   files: ['**/*.(t|j)sx'],
    //   customSyntax: 'postcss-jsx',
    // },
    // {
    //   files: ['**/*.(t|j)s'],
    //   customSyntax: 'postcss-jsx',
    // },
  ],
};

export default stylelintConfig;

module.exports = stylelintConfig;
