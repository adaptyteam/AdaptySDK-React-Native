module.exports = {
  projectRoot: `${__dirname}/examples/SubscriptionsExpo`,
  watchFolders: [__dirname],
  resolver: {
    sourceExts: ['ts', 'tsx', 'js'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
