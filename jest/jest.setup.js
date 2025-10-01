jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native', () => {
  const RN = {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
    NativeModules: {
      RNAdapty: {
        getConstants: () => ({ HANDLER: 'handle' }),
        handle: async (method, params) => {
          return method;
        },
      },
    },
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
  };

  return RN;
});
