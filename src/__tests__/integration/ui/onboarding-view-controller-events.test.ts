import { Adapty } from '@/adapty-handler';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import {
  AdaptyUiOnboardingMeta,
  OnboardingEventHandlers,
} from '@/ui/types';
import {
  createOnboardingViewController,
  cleanupOnboardingViewController,
} from './setup.utils';
import { emitOnboardingCloseEvent } from './event-emitter.utils';

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

    // Typed test data
    const testMeta: AdaptyUiOnboardingMeta = {
      onboardingId: 'test_onboarding_123',
      screenClientId: 'welcome_screen',
      screenIndex: 0,
      totalScreens: 3,
    };

    // Emit native event
    emitOnboardingCloseEvent(viewId, 'close_button_1', testMeta);

    // Verify handler was called with correct arguments
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(onCloseHandler).toHaveBeenCalledWith('close_button_1', testMeta);
  });

  it('should filter events by viewId', async () => {
    const onCloseHandler: jest.MockedFunction<
      OnboardingEventHandlers['onClose']
    > = jest.fn();

    view.setEventHandlers({
      onClose: onCloseHandler,
    });

    // Typed test data
    const testMeta: AdaptyUiOnboardingMeta = {
      onboardingId: 'test',
      screenClientId: 'screen',
      screenIndex: 0,
      totalScreens: 1,
    };

    // Emit event for DIFFERENT view
    emitOnboardingCloseEvent('different_view_id', 'action', testMeta);

    // Handler should NOT be called
    expect(onCloseHandler).not.toHaveBeenCalled();
  });
});

