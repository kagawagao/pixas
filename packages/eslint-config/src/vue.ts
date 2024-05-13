module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['standard', 'prettier', 'plugin:prettier/recommended', 'plugin:vue/vue3-essential'],
  plugins: ['prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'standard',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-essential',
      ],
      plugins: ['prettier', '@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
      rules: {
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        '@typescript-eslint/consistent-type-assertions': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        '@typescript-eslint/no-namespace': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            // args: 'none',
            // ignoreRestSiblings: true,
          },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
        'prettier/prettier': 'error',
        'standard/no-callback-literal': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        quotes: 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: false,
          },
        ],
      },
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      plugins: ['vue', 'prettier', '@typescript-eslint'],
      extends: [
        'standard',
        'prettier',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'no-console': 'off',
        'vue/multi-word-component-names': 'off',
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        '@typescript-eslint/consistent-type-assertions': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        '@typescript-eslint/no-namespace': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            // args: 'none',
            // ignoreRestSiblings: true,
          },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
        'prettier/prettier': 'error',
        'standard/no-callback-literal': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        quotes: 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: false,
          },
        ],
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    'standard/no-callback-literal': 'off',
    'vue/multi-word-component-names': 'off',
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
  },
  globals: {
    h: true,
    defineProps: true,
    defineEmits: true,
  },
};
