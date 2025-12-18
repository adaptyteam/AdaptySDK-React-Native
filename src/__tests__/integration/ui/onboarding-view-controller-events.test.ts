import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import { OnboardingEventHandlers } from '@/ui/types';
import {
  createOnboardingViewController,
  cleanupOnboardingViewController,
} from './setup.utils';
import {
  emitOnboardingCloseEvent,
  emitOnboardingAnalyticsEvent,
  emitOnboardingStateUpdatedEvent,
  emitOnboardingFinishedLoadingEvent,
  emitOnboardingPaywallEvent,
  emitOnboardingCustomEvent,
  emitOnboardingErrorEvent,
} from './event-emitter.utils';
import {
  ONBOARDING_ANALYTICS_ONBOARDING_STARTED,
  ONBOARDING_STATE_UPDATED_TEXT_INPUT,
  ONBOARDING_STATE_UPDATED_EMAIL_INPUT,
  ONBOARDING_STATE_UPDATED_NUMBER_INPUT,
  ONBOARDING_STATE_UPDATED_SELECT_OPTION,
  ONBOARDING_STATE_UPDATED_MULTI_SELECT_SINGLE,
  ONBOARDING_STATE_UPDATED_MULTI_SELECT_MULTIPLE,
  ONBOARDING_STATE_UPDATED_MULTI_SELECT_EMPTY,
  ONBOARDING_STATE_UPDATED_DATE_PICKER_FULL,
  ONBOARDING_STATE_UPDATED_DATE_PICKER_PARTIAL,
  ONBOARDING_DID_FINISH_LOADING,
  ONBOARDING_PAYWALL_ACTION,
  ONBOARDING_CUSTOM_ACTION,
  ONBOARDING_ERROR_EVENT,
} from './onboarding-bridge-event-samples';

// Helper to convert snake_case meta to expected camelCase format
function expectMetaToBe(snakeCaseMeta: {
  onboarding_id: string;
  screen_cid: string;
  screen_index: number;
  total_screens: number;
}) {
  return expect.objectContaining({
    onboardingId: snakeCaseMeta.onboarding_id,
    screenClientId: snakeCaseMeta.screen_cid,
    screenIndex: snakeCaseMeta.screen_index,
    totalScreens: snakeCaseMeta.total_screens,
  });
}

describe('OnboardingViewController - onClose event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onClose handler when native event is emitted', async () => {
    const onCloseHandler: jest.MockedFunction<
      OnboardingEventHandlers['onClose']
    > = jest.fn().mockReturnValue(true);

    // Subscribe to event
    view.setEventHandlers({
      onClose: onCloseHandler,
    });

    // Get view ID (it's private, but we can access it for testing)
    const viewId = (view as any).id;

    // Typed test data in native format (snake_case)
    const testMeta = {
      onboarding_id: 'test_onboarding_123',
      screen_cid: 'welcome_screen',
      screen_index: 0,
      total_screens: 3,
    };

    // Emit native event
    emitOnboardingCloseEvent(viewId, 'close_button_1', testMeta);

    // Verify handler was called with correct arguments (camelCase after decoding)
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onCloseHandler).toHaveBeenCalledWith('close_button_1', expectMetaToBe(testMeta));
  });

  it('should filter events by viewId', async () => {
    const onCloseHandler: jest.MockedFunction<
      OnboardingEventHandlers['onClose']
    > = jest.fn();

    view.setEventHandlers({
      onClose: onCloseHandler,
    });

    // Typed test data in native format (snake_case)
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Emit event for DIFFERENT view
    emitOnboardingCloseEvent('different_view_id', 'action', testMeta);

    // Handler should NOT be called
    expect(onCloseHandler).not.toHaveBeenCalled();
  });
});

describe('OnboardingViewController - onAnalytics event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onAnalytics handler when native event is emitted', async () => {
    const onAnalyticsHandler: jest.MockedFunction<
      OnboardingEventHandlers['onAnalytics']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onAnalytics: onAnalyticsHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_ANALYTICS_ONBOARDING_STARTED;

    emitOnboardingAnalyticsEvent(
      viewId,
      sample.event,
      sample.meta,
    );

    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(onAnalyticsHandler).toHaveBeenCalledWith(
      sample.event,
      expectMetaToBe(sample.meta),
    );
  });
});

describe('OnboardingViewController - onStateUpdated event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onStateUpdated handler for text input', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_TEXT_INPUT;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: action.element_id,
        elementType: 'input',
        value: expect.objectContaining({
          type: 'text',
          value: 'Test-nick',
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for email input', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_EMAIL_INPUT;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'email',
        elementType: 'input',
        value: expect.objectContaining({
          type: 'email',
          value: 'test@example.com',
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for number input', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_NUMBER_INPUT;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'age',
        elementType: 'input',
        value: expect.objectContaining({
          type: 'number',
          value: 25,
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for select option', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_SELECT_OPTION;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'experience_level',
        elementType: 'select',
        value: expect.objectContaining({
          id: 'intermediate',
          value: 'intermediate',
          label: 'Intermediate',
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for multi_select with one item', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_MULTI_SELECT_SINGLE;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'goal',
        elementType: 'multi_select',
        value: expect.arrayContaining([
          expect.objectContaining({
            id: 'QmdFI',
            value: 'skill-acquisition',
            label: 'Skill Acquisition',
          }),
        ]),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for multi_select with multiple items', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_MULTI_SELECT_MULTIPLE;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'goal',
        elementType: 'multi_select',
        value: expect.arrayContaining([
          expect.objectContaining({
            id: 'QmdFI',
            value: 'skill-acquisition',
            label: 'Skill Acquisition',
          }),
          expect.objectContaining({
            id: 'abc123',
            value: 'productivity',
            label: 'Productivity',
          }),
        ]),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for multi_select with empty array', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_MULTI_SELECT_EMPTY;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'goal',
        elementType: 'multi_select',
        value: [],
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for date_picker with full date', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_DATE_PICKER_FULL;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'birth_date',
        elementType: 'date_picker',
        value: expect.objectContaining({
          day: 15,
          month: 6,
          year: 1990,
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });

  it('should call onStateUpdated handler for date_picker with partial date', async () => {
    const onStateUpdatedHandler: jest.MockedFunction<
      OnboardingEventHandlers['onStateUpdated']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onStateUpdated: onStateUpdatedHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_STATE_UPDATED_DATE_PICKER_PARTIAL;
    const action = sample.action as any;

    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: action.element_id,
        elementType: action.element_type,
        value: action.value,
      },
      sample.meta,
    );

    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(onStateUpdatedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: 'birth_year',
        elementType: 'date_picker',
        value: expect.objectContaining({
          year: 1995,
        }),
      }),
      expectMetaToBe(sample.meta),
    );
  });
});

describe('OnboardingViewController - onFinishedLoading event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onFinishedLoading handler when loading completes', async () => {
    const onFinishedLoadingHandler: jest.MockedFunction<
      OnboardingEventHandlers['onFinishedLoading']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onFinishedLoading: onFinishedLoadingHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_DID_FINISH_LOADING;

    // Emit with snake_case meta (native format)
    emitOnboardingFinishedLoadingEvent(viewId, sample.meta);

    expect(onFinishedLoadingHandler).toHaveBeenCalledTimes(1);
    // Handler receives decoded meta (camelCase)
    expect(onFinishedLoadingHandler).toHaveBeenCalledWith(expectMetaToBe(sample.meta));
  });
});

describe('OnboardingViewController - onPaywall event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onPaywall handler when paywall action triggered', async () => {
    const onPaywallHandler: jest.MockedFunction<
      OnboardingEventHandlers['onPaywall']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onPaywall: onPaywallHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_PAYWALL_ACTION;

    emitOnboardingPaywallEvent(
      viewId,
      sample.action_id,
      sample.meta,
    );

    expect(onPaywallHandler).toHaveBeenCalledTimes(1);
    expect(onPaywallHandler).toHaveBeenCalledWith(
      sample.action_id,
      expectMetaToBe(sample.meta),
    );
  });
});

describe('OnboardingViewController - onCustom event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onCustom handler when custom action triggered', async () => {
    const onCustomHandler: jest.MockedFunction<
      OnboardingEventHandlers['onCustom']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onCustom: onCustomHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_CUSTOM_ACTION;

    emitOnboardingCustomEvent(
      viewId,
      sample.action_id,
      sample.meta,
    );

    expect(onCustomHandler).toHaveBeenCalledTimes(1);
    expect(onCustomHandler).toHaveBeenCalledWith(
      sample.action_id,
      expectMetaToBe(sample.meta),
    );
  });
});

describe('OnboardingViewController - onError event', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call onError handler when error occurs', async () => {
    const onErrorHandler: jest.MockedFunction<
      OnboardingEventHandlers['onError']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onError: onErrorHandler,
    });

    const viewId = (view as any).id;
    const sample = ONBOARDING_ERROR_EVENT;

    emitOnboardingErrorEvent(viewId, sample.error);

    expect(onErrorHandler).toHaveBeenCalledTimes(1);
    const firstCall = onErrorHandler.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [errorArg] = firstCall as [AdaptyError];
    expect(errorArg).toBeInstanceOf(AdaptyError);
    expect(errorArg.adaptyCode).toBe(sample.error.adaptyCode);
    expect(errorArg.message).toContain(sample.error.message);
    expect(errorArg.detail).toBe(sample.error.detail);
  });
});

describe('OnboardingViewController - event viewId filtering', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should ignore events when viewId does not match', async () => {
    // Create mock handlers for all event types
    const onCloseHandler = jest.fn().mockReturnValue(false);
    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    const onStateUpdatedHandler = jest.fn().mockReturnValue(false);
    const onFinishedLoadingHandler = jest.fn().mockReturnValue(false);
    const onPaywallHandler = jest.fn().mockReturnValue(false);
    const onCustomHandler = jest.fn().mockReturnValue(false);
    const onErrorHandler = jest.fn().mockReturnValue(false);

    // Register all handlers
    view.setEventHandlers({
      onClose: onCloseHandler,
      onAnalytics: onAnalyticsHandler,
      onStateUpdated: onStateUpdatedHandler,
      onFinishedLoading: onFinishedLoadingHandler,
      onPaywall: onPaywallHandler,
      onCustom: onCustomHandler,
      onError: onErrorHandler,
    });

    // Use a different viewId
    const wrongViewId = 'wrong_view_id_12345';
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Emit all event types with wrong viewId
    emitOnboardingCloseEvent(wrongViewId, 'close_action', testMeta);
    emitOnboardingAnalyticsEvent(
      wrongViewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    emitOnboardingStateUpdatedEvent(
      wrongViewId,
      {
        elementId: 'test_input',
        elementType: 'input',
        value: { type: 'text', value: 'test' },
      },
      testMeta,
    );
    emitOnboardingFinishedLoadingEvent(wrongViewId, testMeta);
    emitOnboardingPaywallEvent(wrongViewId, 'paywall_action', testMeta);
    emitOnboardingCustomEvent(wrongViewId, 'custom_action', testMeta);
    emitOnboardingErrorEvent(wrongViewId, ONBOARDING_ERROR_EVENT.error);

    // Verify that NONE of the handlers were called
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onAnalyticsHandler).not.toHaveBeenCalled();
    expect(onStateUpdatedHandler).not.toHaveBeenCalled();
    expect(onFinishedLoadingHandler).not.toHaveBeenCalled();
    expect(onPaywallHandler).not.toHaveBeenCalled();
    expect(onCustomHandler).not.toHaveBeenCalled();
    expect(onErrorHandler).not.toHaveBeenCalled();
  });
});

describe('OnboardingViewController - dismiss on handler return value', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should call dismiss when any handler returns true', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Test onClose returning true
    const onCloseHandler = jest.fn().mockReturnValue(true);
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    view.setEventHandlers({ onClose: onCloseHandler });
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onCloseHandler.mockClear();
    dismissSpy.mockClear();

    // Test onAnalytics returning true
    const onAnalyticsHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onAnalytics: onAnalyticsHandler });
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onAnalyticsHandler.mockClear();
    dismissSpy.mockClear();

    // Test onStateUpdated returning true
    const onStateUpdatedHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onStateUpdated: onStateUpdatedHandler });
    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: 'test_input',
        elementType: 'input',
        value: { type: 'text', value: 'test' },
      },
      testMeta,
    );
    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onStateUpdatedHandler.mockClear();
    dismissSpy.mockClear();

    // Test onFinishedLoading returning true
    const onFinishedLoadingHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onFinishedLoading: onFinishedLoadingHandler });
    emitOnboardingFinishedLoadingEvent(viewId, testMeta);
    expect(onFinishedLoadingHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onFinishedLoadingHandler.mockClear();
    dismissSpy.mockClear();

    // Test onPaywall returning true
    const onPaywallHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onPaywall: onPaywallHandler });
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);
    expect(onPaywallHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onPaywallHandler.mockClear();
    dismissSpy.mockClear();

    // Test onCustom returning true
    const onCustomHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onCustom: onCustomHandler });
    emitOnboardingCustomEvent(viewId, 'custom_action', testMeta);
    expect(onCustomHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onCustomHandler.mockClear();
    dismissSpy.mockClear();

    // Test onError returning true
    const onErrorHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onError: onErrorHandler });
    emitOnboardingErrorEvent(viewId, ONBOARDING_ERROR_EVENT.error);
    expect(onErrorHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should NOT call dismiss when handlers return false', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Test onClose returning false
    const onCloseHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: onCloseHandler });
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onCloseHandler.mockClear();

    // Test onAnalytics returning false
    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onAnalytics: onAnalyticsHandler });
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onAnalyticsHandler.mockClear();

    // Test onStateUpdated returning false
    const onStateUpdatedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onStateUpdated: onStateUpdatedHandler });
    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: 'test_input',
        elementType: 'input',
        value: { type: 'text', value: 'test' },
      },
      testMeta,
    );
    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onStateUpdatedHandler.mockClear();

    // Test onFinishedLoading returning false
    const onFinishedLoadingHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onFinishedLoading: onFinishedLoadingHandler });
    emitOnboardingFinishedLoadingEvent(viewId, testMeta);
    expect(onFinishedLoadingHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onFinishedLoadingHandler.mockClear();

    // Test onPaywall returning false
    const onPaywallHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onPaywall: onPaywallHandler });
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);
    expect(onPaywallHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onPaywallHandler.mockClear();

    // Test onCustom returning false
    const onCustomHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onCustom: onCustomHandler });
    emitOnboardingCustomEvent(viewId, 'custom_action', testMeta);
    expect(onCustomHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onCustomHandler.mockClear();

    // Test onError returning false
    const onErrorHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onError: onErrorHandler });
    emitOnboardingErrorEvent(viewId, ONBOARDING_ERROR_EVENT.error);
    expect(onErrorHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });

  it('should NOT call dismiss when handlers return undefined', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Test onClose returning undefined
    const onCloseHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onClose: onCloseHandler });
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onCloseHandler.mockClear();

    // Test onAnalytics returning undefined
    const onAnalyticsHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onAnalytics: onAnalyticsHandler });
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onAnalyticsHandler.mockClear();

    // Test onStateUpdated returning undefined
    const onStateUpdatedHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onStateUpdated: onStateUpdatedHandler });
    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: 'test_input',
        elementType: 'input',
        value: { type: 'text', value: 'test' },
      },
      testMeta,
    );
    expect(onStateUpdatedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onStateUpdatedHandler.mockClear();

    // Test onFinishedLoading returning undefined
    const onFinishedLoadingHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onFinishedLoading: onFinishedLoadingHandler });
    emitOnboardingFinishedLoadingEvent(viewId, testMeta);
    expect(onFinishedLoadingHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onFinishedLoadingHandler.mockClear();

    // Test onPaywall returning undefined
    const onPaywallHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onPaywall: onPaywallHandler });
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);
    expect(onPaywallHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onPaywallHandler.mockClear();

    // Test onCustom returning undefined
    const onCustomHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onCustom: onCustomHandler });
    emitOnboardingCustomEvent(viewId, 'custom_action', testMeta);
    expect(onCustomHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onCustomHandler.mockClear();

    // Test onError returning undefined
    const onErrorHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onError: onErrorHandler });
    emitOnboardingErrorEvent(viewId, ONBOARDING_ERROR_EVENT.error);
    expect(onErrorHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });
});

describe('OnboardingViewController - setEventHandlers merge behavior', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should preserve previously set handlers when adding new ones', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Set first handler
    const onCloseHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: onCloseHandler });

    // Set second handler - onClose should still be active
    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onAnalytics: onAnalyticsHandler });

    // Emit events for both handlers
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );

    // Both handlers should have been called
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onCloseHandler).toHaveBeenCalledWith('close_action', expectMetaToBe(testMeta));
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(onAnalyticsHandler).toHaveBeenCalledWith(
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      expectMetaToBe(testMeta),
    );
  });

  it('should replace handler when setting same event type again', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Set first onClose handler
    const onCloseHandler1 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: onCloseHandler1 });

    // Replace with second onClose handler
    const onCloseHandler2 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: onCloseHandler2 });

    // Emit close event
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);

    // Only the second handler should be called
    expect(onCloseHandler1).not.toHaveBeenCalled();
    expect(onCloseHandler2).toHaveBeenCalledTimes(1);
    expect(onCloseHandler2).toHaveBeenCalledWith('close_action', expectMetaToBe(testMeta));
  });

  it('should preserve multiple handlers across successive setEventHandlers calls', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Set handlers one by one
    const onCloseHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: onCloseHandler });

    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onAnalytics: onAnalyticsHandler });

    const onPaywallHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onPaywall: onPaywallHandler });

    const onCustomHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onCustom: onCustomHandler });

    // Emit all events
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);
    emitOnboardingCustomEvent(viewId, 'custom_action', testMeta);

    // All handlers should have been called
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(onPaywallHandler).toHaveBeenCalledTimes(1);
    expect(onCustomHandler).toHaveBeenCalledTimes(1);
  });
});

describe('OnboardingViewController - multiple views isolation', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should isolate event handlers between view instances', async () => {
    // Create a second view using the SAME adapty instance
    const onboarding2 = await adapty.getOnboarding('test_placement');
    const view2 = await OnboardingViewController.create(onboarding2);

    try {
      const viewId1 = (view as any).id;
      const viewId2 = (view2 as any).id;

      const testMeta = {
        onboarding_id: 'test',
        screen_cid: 'screen',
        screen_index: 0,
        total_screens: 1,
      };

      // Create handlers for both views
      const handler1 = jest.fn().mockReturnValue(false);
      const handler2 = jest.fn().mockReturnValue(false);

      // Register handlers on both views
      const unsubscribe1 = view.setEventHandlers({ onClose: handler1 });
      view2.setEventHandlers({ onClose: handler2 });

      // Emit events to both views - both should receive
      emitOnboardingCloseEvent(viewId1, 'action1', testMeta);
      emitOnboardingCloseEvent(viewId2, 'action2', testMeta);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      // Clear mocks
      handler1.mockClear();
      handler2.mockClear();

      // Unsubscribe first view
      unsubscribe1();

      // Emit events again
      emitOnboardingCloseEvent(viewId1, 'action3', testMeta);
      emitOnboardingCloseEvent(viewId2, 'action4', testMeta);

      // First view should not receive (unsubscribed)
      expect(handler1).not.toHaveBeenCalled();
      // Second view should still receive (not affected by first view's unsubscribe)
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledWith('action4', expectMetaToBe(testMeta));
    } finally {
      // Cleanup second view (no need to cleanup adapty, it's shared)
      // view2 cleanup happens in afterEach through adapty.removeAllListeners
    }
  });
});

describe('OnboardingViewController - default event handlers', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should auto-dismiss onboarding view when onClose event is emitted with default handler', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Spy on dismiss method to verify it's called
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Emit close event WITHOUT setting custom handler
    // Default handler (onClose: () => true) should be active from create()
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);

    // Verify dismiss was called due to default handler returning true
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should allow overriding default onClose handler', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Override default handler with one that returns false
    const customHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onClose: customHandler });

    // Emit close event
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);

    // Custom handler should be called
    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(customHandler).toHaveBeenCalledWith('close_action', expectMetaToBe(testMeta));

    // Dismiss should NOT be called because custom handler returned false
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });
});

describe('OnboardingViewController - dismiss cleanup', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should unsubscribe all event listeners after dismiss', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Set up handlers for multiple event types
    const onCloseHandler = jest.fn().mockReturnValue(false);
    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    const onStateUpdatedHandler = jest.fn().mockReturnValue(false);
    const onPaywallHandler = jest.fn().mockReturnValue(false);
    const onCustomHandler = jest.fn().mockReturnValue(false);
    const onErrorHandler = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onClose: onCloseHandler,
      onAnalytics: onAnalyticsHandler,
      onStateUpdated: onStateUpdatedHandler,
      onPaywall: onPaywallHandler,
      onCustom: onCustomHandler,
      onError: onErrorHandler,
    });

    // Emit events BEFORE dismiss - handlers should be called
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );

    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);

    // Clear mock call history
    onCloseHandler.mockClear();
    onAnalyticsHandler.mockClear();
    onStateUpdatedHandler.mockClear();
    onPaywallHandler.mockClear();
    onCustomHandler.mockClear();
    onErrorHandler.mockClear();

    // Call dismiss
    await view.dismiss();

    // Emit events AFTER dismiss - handlers should NOT be called
    emitOnboardingCloseEvent(viewId, 'close_action_2', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    emitOnboardingStateUpdatedEvent(
      viewId,
      {
        elementId: 'test_input',
        elementType: 'input',
        value: { type: 'text', value: 'test' },
      },
      testMeta,
    );
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);
    emitOnboardingCustomEvent(viewId, 'custom_action', testMeta);
    emitOnboardingErrorEvent(viewId, ONBOARDING_ERROR_EVENT.error);

    // Verify that NONE of the handlers were called after dismiss
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onAnalyticsHandler).not.toHaveBeenCalled();
    expect(onStateUpdatedHandler).not.toHaveBeenCalled();
    expect(onPaywallHandler).not.toHaveBeenCalled();
    expect(onCustomHandler).not.toHaveBeenCalled();
    expect(onErrorHandler).not.toHaveBeenCalled();
  });

  it('should not throw error when dismiss is called without any handlers set', async () => {
    // Don't set any custom handlers, only default ones exist
    await expect(view.dismiss()).resolves.not.toThrow();
  });

  it('should not throw error when dismiss is called multiple times', async () => {
    await view.dismiss();
    // Second dismiss should not throw
    await expect(view.dismiss()).resolves.not.toThrow();
  });
});

describe('OnboardingViewController - unsubscribe functionality', () => {
  let adapty: Adapty;
  let view: OnboardingViewController;

  beforeEach(async () => {
    const result = await createOnboardingViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupOnboardingViewController(view, adapty);
  });

  it('should unsubscribe all handlers using returned unsubscribe function', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // Set up multiple handlers
    const onCloseHandler = jest.fn().mockReturnValue(false);
    const onAnalyticsHandler = jest.fn().mockReturnValue(false);
    const onPaywallHandler = jest.fn().mockReturnValue(false);

    const unsubscribe = view.setEventHandlers({
      onClose: onCloseHandler,
      onAnalytics: onAnalyticsHandler,
      onPaywall: onPaywallHandler,
    });

    // Emit events BEFORE unsubscribe - handlers should be called
    emitOnboardingCloseEvent(viewId, 'close_action', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    emitOnboardingPaywallEvent(viewId, 'paywall_action', testMeta);

    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onAnalyticsHandler).toHaveBeenCalledTimes(1);
    expect(onPaywallHandler).toHaveBeenCalledTimes(1);

    // Clear mocks
    onCloseHandler.mockClear();
    onAnalyticsHandler.mockClear();
    onPaywallHandler.mockClear();

    // Call unsubscribe
    unsubscribe();
    // Idempotency: second call should not throw
    expect(() => unsubscribe()).not.toThrow();

    // Emit events AFTER unsubscribe - handlers should NOT be called
    emitOnboardingCloseEvent(viewId, 'close_action_2', testMeta);
    emitOnboardingAnalyticsEvent(
      viewId,
      ONBOARDING_ANALYTICS_ONBOARDING_STARTED.event,
      testMeta,
    );
    emitOnboardingPaywallEvent(viewId, 'paywall_action_2', testMeta);

    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onAnalyticsHandler).not.toHaveBeenCalled();
    expect(onPaywallHandler).not.toHaveBeenCalled();
  });

  it('should allow re-subscribing after unsubscribe', async () => {
    const viewId = (view as any).id;
    const testMeta = {
      onboarding_id: 'test',
      screen_cid: 'screen',
      screen_index: 0,
      total_screens: 1,
    };

    // First subscription
    const onCloseHandler1 = jest.fn().mockReturnValue(false);
    const unsubscribe1 = view.setEventHandlers({
      onClose: onCloseHandler1,
    });

    // Emit event - should be handled
    emitOnboardingCloseEvent(viewId, 'close_action_1', testMeta);
    expect(onCloseHandler1).toHaveBeenCalledTimes(1);

    // Unsubscribe
    unsubscribe1();
    onCloseHandler1.mockClear();

    // Emit event - should NOT be handled
    emitOnboardingCloseEvent(viewId, 'close_action_2', testMeta);
    expect(onCloseHandler1).not.toHaveBeenCalled();

    // Re-subscribe with new handler
    const onCloseHandler2 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({
      onClose: onCloseHandler2,
    });

    // Emit event - new handler should be called
    emitOnboardingCloseEvent(viewId, 'close_action_3', testMeta);
    expect(onCloseHandler1).not.toHaveBeenCalled(); // Old handler still not called
    expect(onCloseHandler2).toHaveBeenCalledTimes(1); // New handler called
  });
});

