module.exports = {
  root: true, // stops ESLint walking up to the repo-root config (which needs eslint-plugin-react)
  env: { node: true, es2022: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
