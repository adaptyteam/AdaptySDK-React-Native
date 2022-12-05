module.exports = {
  dependency: {
    platforms: {
      ios: {},
      android: {
        sourceDir: './lib/android/',
      },
    },
  },
  project: {
    ios: {
      project: './examples/SubscriptionsJS/ios/example.xcworkspace',
    },
    android: {
      sourceDir: './examples/SubscriptionsJS/android/',
    },
  },
};
