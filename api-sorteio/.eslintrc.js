module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',     
    'prettier',                        
  ],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist/', '.eslintrc.js'],
  rules: {
    'prettier/prettier': 'error',     
   
  },
};
