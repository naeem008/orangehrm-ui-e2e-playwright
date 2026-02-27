import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    playwright.configs['flat/recommended'],
    eslintConfigPrettier,
    {
        files: ['**/*.ts'],
        rules: {
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/no-skipped-test': 'warn',
            'playwright/expect-expect': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn'
        }
    }
);