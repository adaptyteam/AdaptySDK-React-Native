/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = function (api) {
  api && api.cache(false);
  return {
    presets: [
      'module:@react-native/babel-preset',
    ]
  };
};
