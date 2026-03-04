import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const react19LegacyRulesOff = {
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/no-unused-prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
};

export default [
    js.configs.recommended,
    importPlugin.flatConfigs.recommended,
    jsxA11yPlugin.flatConfigs.recommended,
    reactPlugin.configs.flat.recommended,
    reactHooksPlugin.configs['recommended-latest'],
    {
        ignores: ['dist/', 'extension.js']
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                URLSearchParams: 'readonly',
                require: 'readonly',
                localStorage: 'readonly',
                CustomEvent: 'readonly',
                ResizeObserver: 'readonly',
                process: 'readonly',
                console: 'readonly'
            }
        },
        settings: {
            'import/extensions': ['.js', '.jsx'],
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx']
                }
            },
            react: {
                version: 'detect'
            },
            linkComponents: ['Hyperlink', { name: 'Link', linkAttribute: 'to' }]
        },
        rules: {
            'import/named': 'off',
            'no-unused-vars': ['warn', { caughtErrors: 'none' }],
            ...react19LegacyRulesOff
        }
    }
];
