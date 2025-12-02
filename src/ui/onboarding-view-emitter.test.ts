import type { EmitterSubscription } from 'react-native';
import { OnboardingViewEmitter } from './onboarding-view-emitter';
import type { OnboardingEventHandlers } from './types';
import { $bridge } from '@/bridge';

// Mock dependencies
jest.mock('@/bridge', () => ({
  $bridge: {
    addEventListener: jest.fn(),
    removeAllEventListeners: jest.fn(),
  },
}));

const mockBridge = $bridge as jest.Mocked<typeof $bridge>;

describe('OnboardingViewEmitter', () => {
  let emitter: OnboardingViewEmitter;
  let mockSubscription: EmitterSubscription;
  let mockOnRequestClose: jest.MockedFunction<() => Promise<void>>;

  const TEST_VIEW_ID = 'test-view-id';
  const DIFFERENT_VIEW_ID = 'different-view-id';

  beforeEach(() => {
    jest.clearAllMocks();

    mockSubscription = {
      remove: jest.fn(),
    } as any;

    mockBridge.addEventListener.mockReturnValue(mockSubscription);
    mockOnRequestClose = jest.fn().mockResolvedValue(undefined);

    emitter = new OnboardingViewEmitter(TEST_VIEW_ID);
  });

  describe('constructor', () => {
    it('should initialize with provided viewId', () => {
      const customEmitter = new OnboardingViewEmitter('custom-view-id');
      expect(customEmitter).toBeInstanceOf(OnboardingViewEmitter);
    });
  });

  describe('addListener', () => {
    it('should register native event listener for onError', () => {
      const handler = jest.fn();

      emitter.addListener('onError', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_did_fail_with_error',
        expect.any(Function),
      );
    });

    it('should register native event listener for onAnalytics', () => {
      const handler = jest.fn();

      emitter.addListener('onAnalytics', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_on_analytics_action',
        expect.any(Function),
      );
    });

    it('should register native event listener for onFinishedLoading', () => {
      const handler = jest.fn();

      emitter.addListener('onFinishedLoading', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_did_finish_loading',
        expect.any(Function),
      );
    });

    it('should register native event listener for onClose', () => {
      const handler = jest.fn();

      emitter.addListener('onClose', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_on_close_action',
        expect.any(Function),
      );
    });

    it('should register native event listener for onCustom', () => {
      const handler = jest.fn();

      emitter.addListener('onCustom', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_on_custom_action',
        expect.any(Function),
      );
    });

    it('should register native event listener for onPaywall', () => {
      const handler = jest.fn();

      emitter.addListener('onPaywall', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_on_paywall_action',
        expect.any(Function),
      );
    });

    it('should register native event listener for onStateUpdated', () => {
      const handler = jest.fn();

      emitter.addListener('onStateUpdated', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledWith(
        'onboarding_on_state_updated_action',
        expect.any(Function),
      );
    });

    it('should reuse existing listener for same native event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.addListener('onError', handler1, mockOnRequestClose);
      emitter.addListener('onError', handler2, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should create separate listeners for different native events', () => {
      const errorHandler = jest.fn();
      const analyticsHandler = jest.fn();

      emitter.addListener('onError', errorHandler, mockOnRequestClose);
      emitter.addListener('onAnalytics', analyticsHandler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledTimes(2);
    });

    it('should throw error for unsupported event type', () => {
      const handler = jest.fn();

      expect(() => {
        emitter.addListener('invalidEvent' as any, handler, mockOnRequestClose);
      }).toThrow('No event config found for handler: invalidEvent');
    });

    it('should return EmitterSubscription', () => {
      const handler = jest.fn();

      const subscription = emitter.addListener(
        'onError',
        handler,
        mockOnRequestClose,
      );

      expect(subscription).toBe(mockSubscription);
    });

    describe('event filtering and handling', () => {
      function simulateNativeEvent(eventData: any) {
        const nativeListener = mockBridge.addEventListener.mock.calls[0]?.[1];
        expect(nativeListener).toBeDefined();

        // Call the listener with proper this context and data parameter
        (nativeListener! as any).call({ rawValue: eventData }, eventData);
      }

      it('should filter events by viewId', () => {
        const handler = jest.fn();
        emitter.addListener('onError', handler, mockOnRequestClose);

        simulateNativeEvent({
          view: { id: DIFFERENT_VIEW_ID },
          error: { message: 'Test error' },
        });

        expect(handler).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onError', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onError', handler, mockOnRequestClose);

        const testError = { message: 'Test error', code: 'test_code' };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          error: testError,
        });

        expect(handler).toHaveBeenCalledWith(testError);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onAnalytics', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onAnalytics', handler, mockOnRequestClose);

        const testEvent = { name: 'screen_view', element_id: 'btn1' };
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          event: testEvent,
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testEvent, testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onFinishedLoading', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onFinishedLoading', handler, mockOnRequestClose);

        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onClose', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onClose', handler, mockOnRequestClose);

        const testActionId = 'close_action';
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          action_id: testActionId,
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testActionId, testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onCustom', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onCustom', handler, mockOnRequestClose);

        const testActionId = 'custom_action';
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          action_id: testActionId,
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testActionId, testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onPaywall', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onPaywall', handler, mockOnRequestClose);

        const testActionId = 'paywall_action';
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          action_id: testActionId,
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testActionId, testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should call handler when viewId matches for onStateUpdated', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onStateUpdated', handler, mockOnRequestClose);

        const testAction = {
          elementId: 'input1',
          value: { type: 'text', value: 'test' },
        };
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          action: testAction,
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(testAction, testMeta);
        expect(mockOnRequestClose).not.toHaveBeenCalled();
      });

      it('should handle onStateUpdated with elementId from action_id', () => {
        const handler = jest.fn().mockReturnValue(false);
        emitter.addListener('onStateUpdated', handler, mockOnRequestClose);

        const testActionId = 'state_action';
        const testMeta = {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        };

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          action_id: testActionId,
          action: null, // No action object
          meta: testMeta,
        });

        expect(handler).toHaveBeenCalledWith(
          { elementId: testActionId },
          testMeta,
        );
      });

      it('should call onRequestClose when handler returns true', () => {
        const handler = jest.fn().mockReturnValue(true);
        emitter.addListener('onError', handler, mockOnRequestClose);

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          error: { message: 'Test error' },
        });

        expect(handler).toHaveBeenCalled();
        expect(mockOnRequestClose).toHaveBeenCalled();
      });

      it('should replace handler when adding multiple handlers for same event', () => {
        const handler1 = jest.fn().mockReturnValue(false);
        const handler2 = jest.fn().mockReturnValue(true);
        const onRequestClose1 = jest.fn().mockResolvedValue(undefined);
        const onRequestClose2 = jest.fn().mockResolvedValue(undefined);

        emitter.addListener('onError', handler1, onRequestClose1);
        emitter.addListener('onError', handler2, onRequestClose2);

        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          error: { message: 'Test error' },
        });

        expect(handler1).not.toHaveBeenCalled(); // handler1 was replaced
        expect(handler2).toHaveBeenCalled(); // only handler2 should be called
        expect(onRequestClose1).not.toHaveBeenCalled(); // handler1 was not called
        expect(onRequestClose2).toHaveBeenCalled(); // handler2 returned true
      });

      it('should handle missing view id gracefully', () => {
        const handler = jest.fn();
        emitter.addListener('onError', handler, mockOnRequestClose);

        simulateNativeEvent({
          // No view object
          error: { message: 'Test error' },
        });

        expect(handler).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all native event subscriptions', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      emitter.addListener('onError', handler1, mockOnRequestClose);
      emitter.addListener('onAnalytics', handler2, mockOnRequestClose);

      emitter.removeAllListeners();

      expect(mockSubscription.remove).toHaveBeenCalledTimes(2);
      expect(mockBridge.removeAllEventListeners).toHaveBeenCalled();
    });

    it('should clear internal state after removing listeners', () => {
      const handler = jest.fn();
      emitter.addListener('onError', handler, mockOnRequestClose);

      emitter.removeAllListeners();

      // Adding listener again should create new native subscription
      emitter.addListener('onError', handler, mockOnRequestClose);

      expect(mockBridge.addEventListener).toHaveBeenCalledTimes(2);
    });

    it('should work when called without any listeners', () => {
      expect(() => {
        emitter.removeAllListeners();
      }).not.toThrow();

      expect(mockBridge.removeAllEventListeners).toHaveBeenCalled();
    });
  });

  describe('event argument extraction', () => {
    it('should extract correct arguments for different event types', () => {
      const handlers: { [K in keyof OnboardingEventHandlers]: jest.Mock } = {
        onError: jest.fn(),
        onAnalytics: jest.fn(),
        onFinishedLoading: jest.fn(),
        onClose: jest.fn(),
        onCustom: jest.fn(),
        onPaywall: jest.fn(),
        onStateUpdated: jest.fn(),
      };

      // Add all listeners
      Object.entries(handlers).forEach(([eventName, handler]) => {
        emitter.addListener(
          eventName as keyof OnboardingEventHandlers,
          handler,
          mockOnRequestClose,
        );
      });

      const mockData = {
        view: { id: TEST_VIEW_ID },
        id: 'onboarding_on_paywall_action', // Event type
        action_id: 'test_action', // Custom action ID
        meta: {
          onboardingId: 'test',
          screenClientId: 'screen1',
          screenIndex: 0,
          totalScreens: 3,
        },
        event: { name: 'screen_view', element_id: 'btn1' },
        action: {
          elementId: 'input1',
          value: { type: 'text', value: 'test' },
        },
        error: { message: 'Test error', code: 'test_code' },
      };

      // Test each event type
      mockBridge.addEventListener.mock.calls.forEach(
        ([eventName, callback], index) => {
          (callback as any).call({ rawValue: mockData }, mockData);

          const handler = Object.values(handlers)[index];
          expect(handler).toHaveBeenCalled();

          switch (eventName) {
            case 'onboarding_did_fail_with_error':
              expect(handler).toHaveBeenCalledWith(mockData.error);
              break;
            case 'onboarding_on_analytics_action':
              expect(handler).toHaveBeenCalledWith(
                mockData.event,
                mockData.meta,
              );
              break;
            case 'onboarding_did_finish_loading':
              expect(handler).toHaveBeenCalledWith(mockData.meta);
              break;
            case 'onboarding_on_close_action':
            case 'onboarding_on_custom_action':
            case 'onboarding_on_paywall_action':
              expect(handler).toHaveBeenCalledWith(
                mockData.action_id,
                mockData.meta,
              );
              break;
            case 'onboarding_on_state_updated_action':
              expect(handler).toHaveBeenCalledWith(
                mockData.action,
                mockData.meta,
              );
              break;
          }
        },
      );
    });
  });

  describe('error handling', () => {
    function simulateNativeEvent(eventData: any) {
      const nativeListener = mockBridge.addEventListener.mock.calls[0]?.[1];
      expect(nativeListener).toBeDefined();

      (nativeListener! as any).call({ rawValue: eventData }, eventData);
    }

    it('should handle missing event data gracefully', () => {
      const handler = jest.fn();
      emitter.addListener('onError', handler, mockOnRequestClose);

      expect(() => {
        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          // Missing error field
        });
      }).not.toThrow();

      expect(handler).toHaveBeenCalledWith(undefined);
    });

    it('should handle onRequestClose errors gracefully', async () => {
      const handler = jest.fn().mockReturnValue(true);
      const onRequestCloseWithError = jest
        .fn()
        .mockRejectedValue(new Error('Close error'));

      emitter.addListener('onError', handler, onRequestCloseWithError);

      expect(() => {
        simulateNativeEvent({
          view: { id: TEST_VIEW_ID },
          error: { message: 'Test error' },
        });
      }).not.toThrow();

      expect(onRequestCloseWithError).toHaveBeenCalled();
    });
  });
});
