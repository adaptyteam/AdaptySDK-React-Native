module.exports = {
  root: true,
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'error',
  },

  "overrides": [
    {
      "files": ["scripts/**/*.js"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
};
