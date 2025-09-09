jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.RNAdapty = {
    getConstants: () => ({ HANDLER: 'handle' }),
    handle: async (method, params) => {
      return method;
    },
  };

  return RN;
});
