import { Platform } from 'react-native';
import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import { FlowViewController } from '@/ui/flow-view-controller';
import { FlowEventHandlers } from '@/ui/types';
import type { AdaptySubscription, AdaptyAccessLevel } from '@/types';
import {
  createFlowViewController,
  cleanupFlowViewController,
} from '../../setup.utils';
import {
  emitFlowUserActionEvent,
  emitFlowPurchaseStartedEvent,
  emitFlowPurchaseCompletedEvent,
  emitFlowPurchaseFailedEvent,
  emitFlowRestoreCompletedEvent,
  emitFlowWebPaymentNavigationFinishedEvent,
} from './flow-event-emitter.utils';
import {
  ANDROID_FLOW_USER_ACTION_SYSTEM_BACK,
  ANDROID_FLOW_PURCHASE_COMPLETED_SUCCESS,
  ANDROID_FLOW_PURCHASE_FAILED,
  ANDROID_FLOW_PURCHASE_STARTED,
  ANDROID_FLOW_RESTORE_COMPLETED_SUCCESS,
  ANDROID_FLOW_WEB_PAYMENT_NAVIGATION_FINISHED,
} from './android-flow-bridge-event-samples';

// Override Platform.OS for Android tests
const originalOS = Platform.OS;
const originalSelect = Platform.select;

beforeAll(() => {
  Platform.OS = 'android';
  Platform.select = jest.fn((obj: any) => obj.android || obj.default);
});

afterAll(() => {
  Platform.OS = originalOS;
  Platform.select = originalSelect;
});

describe('FlowViewController - onAndroidSystemBack event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onAndroidSystemBack handler when system back is pressed', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onAndroidSystemBack']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onAndroidSystemBack: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_USER_ACTION_SYSTEM_BACK;

    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });

  it('should auto-dismiss flow when onAndroidSystemBack event is emitted with default handler', async () => {
    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_USER_ACTION_SYSTEM_BACK;

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue(undefined);

    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should allow overriding default onAndroidSystemBack handler', async () => {
    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_USER_ACTION_SYSTEM_BACK;

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue(undefined);

    const customHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onAndroidSystemBack: customHandler });

    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });
});

describe('FlowViewController - onPurchaseStarted event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onPurchaseStarted handler with Android-specific subscription fields', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_PURCHASE_STARTED;

    emitFlowPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // Verify Android-specific subscription fields
    expect(product.subscription).toBeDefined();
    if (product.subscription) {
      expect(product.subscription.android).toBeDefined();
      if (product.subscription.android) {
        expect(product.subscription.android.renewalType).toBe('autorenewable');
        expect(product.subscription.android.basePlanId).toBe(
          'yearly-premium-6999-base',
        );
      }

      // Verify iOS-specific fields are NOT present
      expect(product.subscription).not.toHaveProperty('ios');
      if (product.subscription.offer) {
        expect(product.subscription.offer).not.toHaveProperty('identifier');
        expect(product.subscription.offer).not.toHaveProperty('phases');
      }
    }
    // iOS property may exist but should be empty for Android products
    if (product.ios) {
      expect(Object.keys(product.ios)).toHaveLength(0);
    }
  });
});

describe('FlowViewController - onPurchaseCompleted event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onPurchaseCompleted handler with Android-specific purchase result fields', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onPurchaseCompleted']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_PURCHASE_COMPLETED_SUCCESS;

    emitFlowPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult, product] = handler.mock.calls[0]!;

    // Verify Android-specific purchase result fields
    expect(purchaseResult.type).toBe('success');
    if (purchaseResult.type === 'success') {
      expect(purchaseResult.android).toBeDefined();
      if (purchaseResult.android) {
        expect(purchaseResult.android.purchaseToken).toBe(
          sample.purchased_result.google_purchase_token,
        );
        expect(purchaseResult.android.purchaseToken).toContain('AO-J1Oy');
      }

      // Verify iOS-specific field is NOT present
      expect(purchaseResult).not.toHaveProperty('ios');

      // Verify Android store in profile
      expect(purchaseResult.profile).toBeDefined();
      if (purchaseResult.profile.subscriptions) {
        const subscription = Object.values(
          purchaseResult.profile.subscriptions,
        )[0] as AdaptySubscription | undefined;
        if (subscription) {
          expect(subscription.store).toBe('play_store');
          expect(subscription.vendorTransactionId).toMatch(/^GPA\./);
          expect(subscription.vendorOriginalTransactionId).toMatch(/^GPA\./);
        }
      }
    }

    // Verify Android-specific product subscription fields
    if (product.subscription?.android) {
      expect(product.subscription.android.renewalType).toBe('autorenewable');
      expect(product.subscription.android.basePlanId).toBe(
        'weekly-premium-599-base',
      );
      if (product.subscription.offer?.android) {
        expect(product.subscription.offer.android.offerTags).toEqual([]);
      }
    }
  });
});

describe('FlowViewController - onPurchaseFailed event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onPurchaseFailed handler with Android-specific product fields', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onPurchaseFailed']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseFailed: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_PURCHASE_FAILED;

    emitFlowPurchaseFailedEvent(
      viewId,
      sample.error,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [error, product] = handler.mock.calls[0]!;

    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);

    // Verify Android-specific subscription fields
    expect(product.subscription).toBeDefined();
    if (product.subscription?.android) {
      expect(product.subscription.android.renewalType).toBe('autorenewable');
      expect(product.subscription.android.basePlanId).toBe(
        'monthly-premium-999-base',
      );
    }

    // Verify iOS-specific fields are NOT present
    if (product.subscription) {
      expect(product.subscription).not.toHaveProperty('ios');
    }
    // iOS property may exist but should be empty for Android products
    if (product.ios) {
      expect(Object.keys(product.ios)).toHaveLength(0);
    }
  });
});

describe('FlowViewController - onRestoreCompleted event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onRestoreCompleted handler with Android-specific profile fields', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onRestoreCompleted']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreCompleted: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_RESTORE_COMPLETED_SUCCESS;

    emitFlowRestoreCompletedEvent(viewId, sample.profile, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [profile] = handler.mock.calls[0]!;

    expect(profile.profileId).toBe(sample.profile.profile_id);

    // Verify Android store in subscriptions
    if (profile.subscriptions) {
      const subscriptions = Object.values(
        profile.subscriptions,
      ) as AdaptySubscription[];
      expect(subscriptions.length).toBeGreaterThan(0);
      subscriptions.forEach(subscription => {
        expect(subscription.store).toBe('play_store');
        expect(subscription.vendorTransactionId).toMatch(/^GPA\./);
        expect(subscription.vendorOriginalTransactionId).toMatch(/^GPA\./);
      });
    }

    // Verify Android store in access levels
    if (profile.accessLevels) {
      const accessLevels = Object.values(
        profile.accessLevels,
      ) as AdaptyAccessLevel[];
      expect(accessLevels.length).toBeGreaterThan(0);
      accessLevels.forEach(accessLevel => {
        expect(accessLevel.store).toBe('play_store');
      });
    }
  });
});

describe('FlowViewController - onWebPaymentNavigationFinished event (Android fields)', () => {
  let adapty: Adapty;
  let view: FlowViewController;

  beforeEach(async () => {
    const result = await createFlowViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupFlowViewController(view, adapty);
  });

  it('should call onWebPaymentNavigationFinished handler with Android-specific product fields', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onWebPaymentNavigationFinished']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onWebPaymentNavigationFinished: handler });

    const viewId = (view as any).id;
    const sample = ANDROID_FLOW_WEB_PAYMENT_NAVIGATION_FINISHED;

    emitFlowWebPaymentNavigationFinishedEvent(
      viewId,
      sample.product,
      undefined,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    expect(product).toBeDefined();
    if (product) {
      expect(product.vendorProductId).toBe(sample.product.vendor_product_id);

      // Verify Android-specific subscription fields
      if (product.subscription?.android) {
        expect(product.subscription.android.renewalType).toBe('autorenewable');
        expect(product.subscription.android.basePlanId).toBe(
          'sixmonth-premium-999-base',
        );
      }

      // Verify iOS-specific fields are NOT present
      if (product.subscription) {
        expect(product.subscription).not.toHaveProperty('ios');
      }
      // iOS property may exist but should be empty for Android products
      if (product.ios) {
        expect(Object.keys(product.ios)).toHaveLength(0);
      }
    }
  });
});
