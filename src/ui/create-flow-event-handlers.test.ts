import { createFlowEventHandlers } from './create-flow-event-handlers';

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

jest.mock('./flow-view-emitter', () => {
  return {
    FlowViewEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

describe('createFlowEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates FlowViewEmitter with provided viewId', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const viewId = 'test-view-id-123';

    createFlowEventHandlers({}, viewId);

    expect(FlowViewEmitter).toHaveBeenCalledWith(viewId);
    expect(FlowViewEmitter).toHaveBeenCalledTimes(1);
  });

  it('merges default handlers with custom handlers', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customHandler = jest.fn(() => false);
    createFlowEventHandlers({ onCloseButtonPress: customHandler }, 'test-id');

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
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createFlowEventHandlers({}, 'test-id');

    // Should register all 19 default handlers:
    // onCloseButtonPress, onAndroidSystemBack, onUrlPress, onCustomAction,
    // onProductSelected, onPurchaseStarted, onPurchaseCompleted, onPurchaseFailed,
    // onRestoreStarted, onRestoreCompleted, onRestoreFailed, onAppeared,
    // onDisappeared, onError, onLoadingProductsFailed, onWebPaymentNavigationFinished,
    // onRequestAppReview, onAnalytics, onRequestPermission
    expect(addListener).toHaveBeenCalledTimes(19);

    const calls = (addListener as jest.Mock).mock.calls;
    const registeredEvents = calls.map(call => call[0]);

    expect(registeredEvents).toContain('onCloseButtonPress');
    expect(registeredEvents).toContain('onAndroidSystemBack');
    expect(registeredEvents).toContain('onRestoreCompleted');
    expect(registeredEvents).toContain('onError');
    expect(registeredEvents).toContain('onPurchaseCompleted');
    expect(registeredEvents).toContain('onUrlPress');
    expect(registeredEvents).toContain('onRequestAppReview');
    expect(registeredEvents).toContain('onAnalytics');
  });

  it('registers custom handlers alongside defaults', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customProductHandler = jest.fn();
    const customPurchaseHandler = jest.fn();

    createFlowEventHandlers(
      {
        onProductSelected: customProductHandler,
        onPurchaseStarted: customPurchaseHandler,
      },
      'test-id',
    );

    // 19 defaults already include onProductSelected and onPurchaseStarted,
    // so custom handlers override defaults — total keys remain 19
    expect(addListener).toHaveBeenCalledTimes(19);

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
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const onRequestClose = jest.fn();
    createFlowEventHandlers({}, 'test-id', onRequestClose);

    // All addListener calls should receive the onRequestClose function
    const calls = (addListener as jest.Mock).mock.calls;
    calls.forEach(call => {
      expect(call[2]).toBe(onRequestClose);
    });
  });

  it('returns unsubscribe function', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const removeAllListeners = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners,
    }));

    const unsubscribe = createFlowEventHandlers({}, 'test-id');

    expect(typeof unsubscribe).toBe('function');

    unsubscribe();

    expect(removeAllListeners).toHaveBeenCalledTimes(1);
  });

  it('custom handlers override default handlers', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customCloseHandler = jest.fn(() => false);
    const customRestoreHandler = jest.fn(() => false);

    createFlowEventHandlers(
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

    // Should still have only 19 handlers, because custom ones override existing defaults
    expect(addListener).toHaveBeenCalledTimes(19);
  });

  it('creates default onRequestClose when not provided', () => {
    const { FlowViewEmitter } = jest.requireMock('./flow-view-emitter');
    const addListener = jest.fn();
    (FlowViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createFlowEventHandlers({}, 'test-id');

    // Should not throw, default async noop function should be created
    const calls = (addListener as jest.Mock).mock.calls;
    expect(calls[0][2]).toBeDefined();
    expect(typeof calls[0][2]).toBe('function');
  });
});
