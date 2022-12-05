module.exports = {
  projectRoot: `${__dirname}/examples/SubscriptionsJS`,
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
