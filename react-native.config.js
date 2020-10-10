module.exports = {
  dependency: {
    platforms: {
      ios: {},
      android: {
        sourceDir: './lib/android/',
      },
    },
    assets: [],
  },
  project: {
    ios: {
      project: './example/ios/example.xcworkspace',
    },
    android: {
      sourceDir: './example/android/',
    },
  },
};
