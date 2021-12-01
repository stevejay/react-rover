module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
    'jest/globals': true
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.eslint.json']
  },
  plugins: ['import', 'unicorn', 'jest', 'testing-library', 'jsx-a11y', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:storybook/recommended',
    'prettier'
  ],
  rules: {
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. react related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put .. last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and . last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$']
        ]
      }
    ],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true
        }
      }
    ],
    'testing-library/no-node-access': 0
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
      ]
    }
  ],
  settings: {
    react: {
      version: '17.0' // Would prefer this to be "detect"
    }
  }
};
