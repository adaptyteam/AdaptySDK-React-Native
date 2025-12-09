import { createPaywallEventHandlers } from './create-paywall-event-handlers';

jest.mock('@/bridge', () => {
  const actual = jest.requireActual('@/bridge');
  return {
    ...actual,
    $bridge: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeAllEventListeners: jest.fn(),
    },
  };
});

jest.mock('./view-emitter', () => {
  return {
    ViewEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

describe('createPaywallEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates ViewEmitter with provided viewId', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const viewId = 'test-view-id-123';

    createPaywallEventHandlers({}, viewId);

    expect(ViewEmitter).toHaveBeenCalledWith(viewId);
    expect(ViewEmitter).toHaveBeenCalledTimes(1);
  });

  it('merges default handlers with custom handlers', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customHandler = jest.fn(() => false);
    createPaywallEventHandlers(
      { onCloseButtonPress: customHandler },
      'test-id',
    );

    // Should register default handlers + custom override
    expect(addListener).toHaveBeenCalled();

    // Check that custom handler was registered
    const calls = (addListener as jest.Mock).mock.calls;
    const closeButtonCall = calls.find(
      call => call[0] === 'onCloseButtonPress',
    );
    expect(closeButtonCall).toBeDefined();
    expect(closeButtonCall[1]).toBe(customHandler);
  });

  it('registers all default handlers when no custom handlers provided', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createPaywallEventHandlers({}, 'test-id');

    // Should register 5 default handlers:
    // onCloseButtonPress, onAndroidSystemBack, onRestoreCompleted, onPurchaseCompleted, onUrlPress
    expect(addListener).toHaveBeenCalledTimes(5);

    const calls = (addListener as jest.Mock).mock.calls;
    const registeredEvents = calls.map(call => call[0]);

    expect(registeredEvents).toContain('onCloseButtonPress');
    expect(registeredEvents).toContain('onAndroidSystemBack');
    expect(registeredEvents).toContain('onRestoreCompleted');
    expect(registeredEvents).toContain('onPurchaseCompleted');
    expect(registeredEvents).toContain('onUrlPress');
  });

  it('registers custom handlers alongside defaults', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customProductHandler = jest.fn();
    const customPurchaseHandler = jest.fn();

    createPaywallEventHandlers(
      {
        onProductSelected: customProductHandler,
        onPurchaseStarted: customPurchaseHandler,
      },
      'test-id',
    );

    // Should register 5 defaults + 2 custom = 7 handlers
    expect(addListener).toHaveBeenCalledTimes(7);

    const calls = (addListener as jest.Mock).mock.calls;
    const productSelectedCall = calls.find(
      call => call[0] === 'onProductSelected',
    );
    const purchaseStartedCall = calls.find(
      call => call[0] === 'onPurchaseStarted',
    );

    expect(productSelectedCall[1]).toBe(customProductHandler);
    expect(purchaseStartedCall[1]).toBe(customPurchaseHandler);
  });

  it('passes onRequestClose to addListener', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const onRequestClose = jest.fn();
    createPaywallEventHandlers({}, 'test-id', onRequestClose);

    // All addListener calls should receive the onRequestClose function
    const calls = (addListener as jest.Mock).mock.calls;
    calls.forEach(call => {
      expect(call[2]).toBe(onRequestClose);
    });
  });

  it('returns unsubscribe function', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const removeAllListeners = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners,
    }));

    const unsubscribe = createPaywallEventHandlers({}, 'test-id');

    expect(typeof unsubscribe).toBe('function');

    unsubscribe();

    expect(removeAllListeners).toHaveBeenCalledTimes(1);
  });

  it('custom handlers override default handlers', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customCloseHandler = jest.fn(() => false);
    const customRestoreHandler = jest.fn(() => false);

    createPaywallEventHandlers(
      {
        onCloseButtonPress: customCloseHandler,
        onRestoreCompleted: customRestoreHandler,
      },
      'test-id',
    );

    const calls = (addListener as jest.Mock).mock.calls;
    const closeCall = calls.find(call => call[0] === 'onCloseButtonPress');
    const restoreCall = calls.find(call => call[0] === 'onRestoreCompleted');

    // Custom handlers should be used instead of defaults
    expect(closeCall[1]).toBe(customCloseHandler);
    expect(restoreCall[1]).toBe(customRestoreHandler);

    // Should still have only 5 handlers (not 7), because custom ones override defaults
    expect(addListener).toHaveBeenCalledTimes(5);
  });

  it('creates default onRequestClose when not provided', () => {
    const { ViewEmitter } = jest.requireMock('./view-emitter');
    const addListener = jest.fn();
    (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createPaywallEventHandlers({}, 'test-id');

    // Should not throw, default async noop function should be created
    const calls = (addListener as jest.Mock).mock.calls;
    expect(calls[0][2]).toBeDefined();
    expect(typeof calls[0][2]).toBe('function');
  });
});
