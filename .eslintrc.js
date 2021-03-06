module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  env: {
    'cypress/globals': true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: [
    'cypress'
  ],
  globals: {
    StroeerVideoplayer: 'readonly'
  }
}
