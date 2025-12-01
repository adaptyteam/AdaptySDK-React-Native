import { createOnboardingEventHandlers } from './create-onboarding-event-handlers';

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

jest.mock('./onboarding-view-emitter', () => {
  return {
    OnboardingViewEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

describe('createOnboardingEventHandlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates OnboardingViewEmitter with provided viewId', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const viewId = 'test-onboarding-view-id-123';

    createOnboardingEventHandlers({}, viewId);

    expect(OnboardingViewEmitter).toHaveBeenCalledWith(viewId);
    expect(OnboardingViewEmitter).toHaveBeenCalledTimes(1);
  });

  it('merges default handlers with custom handlers', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customHandler = jest.fn(() => false);
    createOnboardingEventHandlers({ onClose: customHandler }, 'test-id');

    // Should register default handlers + custom override
    expect(addListener).toHaveBeenCalled();

    // Check that custom handler was registered
    const calls = (addListener as jest.Mock).mock.calls;
    const closeCall = calls.find(call => call[0] === 'onClose');
    expect(closeCall).toBeDefined();
    expect(closeCall[1]).toBe(customHandler);
  });

  it('registers all default handlers when no custom handlers provided', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createOnboardingEventHandlers({}, 'test-id');

    // Should register 1 default handler: onClose
    expect(addListener).toHaveBeenCalledTimes(1);

    const calls = (addListener as jest.Mock).mock.calls;
    const registeredEvents = calls.map(call => call[0]);

    expect(registeredEvents).toContain('onClose');
  });

  it('registers custom handlers alongside defaults', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customCustomHandler = jest.fn();
    const customPaywallHandler = jest.fn();

    createOnboardingEventHandlers(
      {
        onCustom: customCustomHandler,
        onPaywall: customPaywallHandler,
      },
      'test-id',
    );

    // Should register 1 default + 2 custom = 3 handlers
    expect(addListener).toHaveBeenCalledTimes(3);

    const calls = (addListener as jest.Mock).mock.calls;
    const customCall = calls.find(call => call[0] === 'onCustom');
    const paywallCall = calls.find(call => call[0] === 'onPaywall');

    expect(customCall[1]).toBe(customCustomHandler);
    expect(paywallCall[1]).toBe(customPaywallHandler);
  });

  it('passes onRequestClose to addListener', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const onRequestClose = jest.fn();
    createOnboardingEventHandlers({}, 'test-id', onRequestClose);

    // All addListener calls should receive the onRequestClose function
    const calls = (addListener as jest.Mock).mock.calls;
    calls.forEach(call => {
      expect(call[2]).toBe(onRequestClose);
    });
  });

  it('returns unsubscribe function', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const removeAllListeners = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners,
    }));

    const unsubscribe = createOnboardingEventHandlers({}, 'test-id');

    expect(typeof unsubscribe).toBe('function');

    unsubscribe();

    expect(removeAllListeners).toHaveBeenCalledTimes(1);
  });

  it('custom handlers override default handlers', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    const customCloseHandler = jest.fn(() => false);

    createOnboardingEventHandlers(
      {
        onClose: customCloseHandler,
      },
      'test-id',
    );

    const calls = (addListener as jest.Mock).mock.calls;
    const closeCall = calls.find(call => call[0] === 'onClose');

    // Custom handler should be used instead of default
    expect(closeCall[1]).toBe(customCloseHandler);

    // Should still have only 1 handler, because custom one overrides default
    expect(addListener).toHaveBeenCalledTimes(1);
  });

  it('creates default onRequestClose when not provided', () => {
    const { OnboardingViewEmitter } = jest.requireMock(
      './onboarding-view-emitter',
    );
    const addListener = jest.fn();
    (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
      addListener,
      removeAllListeners: jest.fn(),
    }));

    createOnboardingEventHandlers({}, 'test-id');

    // Should not throw, default async noop function should be created
    const calls = (addListener as jest.Mock).mock.calls;
    expect(calls[0][2]).toBeDefined();
    expect(typeof calls[0][2]).toBe('function');
  });
});
