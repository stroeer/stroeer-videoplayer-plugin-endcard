module.exports = {
  extends: 'standard-with-typescript',
  env: {
    'cypress/globals': true
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname
  },
  plugins: [
    'cypress'
  ],
  globals: {
    StroeerVideoplayer: 'readonly'
  },
  rules: {
    'comma-dangle': 'only-multiline'
  }
}
