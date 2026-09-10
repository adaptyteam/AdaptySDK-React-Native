module.exports = {
  root: true,
  extends: '@react-native',
  // SwiftPM autolinking symlinks node_modules libraries into ios/build/generated/autolinking/libs,
  // which is outside the default node_modules ignore.
  ignorePatterns: ['ios/build/'],
};
