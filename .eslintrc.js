module.exports = {
  env: {
    node: true,
    es2022: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'max-len': [
      'error',
      { code: 80, ignoreStrings: true, ignoreTemplateLiterals: true }
    ],
    camelcase: 'off',
    'prefer-destructuring': 'off',
    'no-implicit-globals': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'error'
  }
}
