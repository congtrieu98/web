import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      // các extends khác nếu có
    ],
  }),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '**/*.d.ts',
      '**/out/*',
      'coverage',
      'src/styles/globals.css',
      'next.config.mjs',
      // thêm các patterns bạn muốn ignore
    ],
    // các rules của bạn
    rules: {
      // ...
    },
  },
];
