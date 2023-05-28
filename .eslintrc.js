module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  },
}
