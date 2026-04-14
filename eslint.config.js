// @ts-check

import eslint from '@eslint/js';
import { configs, plugins, rules } from 'eslint-config-airbnb-extended';
import configPrettier from 'eslint-config-prettier';
import pluginCheckFile from 'eslint-plugin-check-file';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from 'typescript-eslint';

const nodeVersion = 24;

const configBase = defineConfig([
  eslint.configs.recommended,
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
  rules.base.importsStrict,
  plugins.node,
  ...configs.node.recommended,
  {
    rules: {
      'no-console': 'error',
      'no-negated-condition': 'error',
      'no-implicit-coercion': 'error',
      'n/no-unsupported-features/node-builtins': ['error', { version: `>=${nodeVersion}.0.0` }],
    },
  },
]);

const configTypescript = defineConfig([
  typescriptEslint.configs.recommendedTypeChecked,
  typescriptEslint.configs.stylisticTypeChecked,
  rules.typescript.typescriptEslintStrict,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { projectService: true },
    },
  },
  {
    files: ['src/types/**/*'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]);

const configNaming = defineConfig([
  {
    plugins: {
      'check-file': pluginCheckFile,
    },
    rules: {
      'check-file/folder-naming-convention': ['error', { '**/*': '+([a-z0-9])*(-+([a-z0-9]))' }],
      'check-file/filename-naming-convention': [
        'error',
        { '**/*': '?(.)+([a-z0-9])*((.|-)+([a-z0-9]))' },
      ],
      'check-file/no-index': 'error',
    },
  },
]);

const configStylistic = defineConfig([
  configPrettier,
  {
    plugins: {
      perfectionist: pluginPerfectionist,
    },
    rules: {
      'curly': ['error', 'all'],
      'import-x/order': 'off',
      'perfectionist/sort-imports': [
        'warn',
        {
          newlinesBetween: 0,
          groups: [
            'builtin',
            'external',
            'subpath',
            'internal',
            'index',
            'sibling',
            'parent',
            'side-effect-style',
            'style',
            'import',
            { newlinesBetween: 1 },
            'type-builtin',
            'type-external',
            'type-subpath',
            'type-internal',
            'type-index',
            'type-sibling',
            'type-parent',
            'type-side-effect',
            'type-import',
          ],
        },
      ],
      '@stylistic/padding-line-between-statements': [
        'warn',
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'any', prev: 'import', next: '*' },
        {
          blankLine: 'always',
          prev: [
            'block',
            'block-like',
            'type',
            'class',
            'let',
            'const',
            'export',
            'expression',
            'interface',
          ],
          next: '*',
        },
        {
          blankLine: 'never',
          prev: ['singleline-let', 'singleline-const'],
          next: ['singleline-let', 'singleline-const'],
        },
        { blankLine: 'any', prev: 'singleline-let', next: 'singleline-const' },
        { blankLine: 'any', prev: 'singleline-const', next: 'singleline-let' },
        { blankLine: 'any', prev: 'singleline-expression', next: 'singleline-expression' },
        { blankLine: 'always', prev: '*', next: ['break', 'continue', 'return', 'throw'] },
      ],
    },
  },
]);

export default defineConfig([
  globalIgnores(['node_modules', 'dist', 'docs']),
  configBase,
  configTypescript,
  configNaming,
  configStylistic,
]);
