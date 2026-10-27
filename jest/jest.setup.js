jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native', () => {
  const RN = {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
    NativeModules: {
      RNAdapty: {
        handle: async (method, params) => {
          return method;
        },
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
    },
    // Reads NativeModules, where integration tests install their mocks
    TurboModuleRegistry: {
      get: jest.fn((name) => RN.NativeModules[name] ?? null),
    },
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
    StyleSheet: {
      create: (styles) => styles,
      flatten: (style) => style,
    },
    View: 'View',
    Text: 'Text',
    requireNativeComponent: jest.fn((name) => name),
  };

  return RN;
});
