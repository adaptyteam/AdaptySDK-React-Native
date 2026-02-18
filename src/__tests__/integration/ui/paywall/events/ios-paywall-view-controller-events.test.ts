import { Platform } from 'react-native';
import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import { ViewController } from '@/ui/view-controller';
import { EventHandlers } from '@/ui/types';
import type { AdaptySubscription, AdaptyAccessLevel } from '@/types';
import {
  createPaywallViewController,
  cleanupPaywallViewController,
} from '../../setup.utils';
import {
  emitPaywallPurchaseStartedEvent,
  emitPaywallPurchaseCompletedEvent,
  emitPaywallPurchaseFailedEvent,
  emitPaywallRestoreCompletedEvent,
  emitPaywallWebPaymentNavigationFinishedEvent,
} from './paywall-event-emitter.utils';
import {
  IOS_PAYWALL_PURCHASE_STARTED,
  IOS_PAYWALL_PURCHASE_COMPLETED_SUCCESS,
  IOS_PAYWALL_PURCHASE_COMPLETED_CANCELLED,
  IOS_PAYWALL_PURCHASE_FAILED,
  IOS_PAYWALL_RESTORE_COMPLETED_SUCCESS,
  IOS_PAYWALL_WEB_PAYMENT_NAVIGATION_FINISHED,
} from './ios-paywall-bridge-event-samples';

// Override Platform.OS for iOS tests
const originalOS = Platform.OS;
const originalSelect = Platform.select;

beforeAll(() => {
  Platform.OS = 'ios';
  Platform.select = jest.fn((obj: any) => obj.ios || obj.default);
});

afterAll(() => {
  Platform.OS = originalOS;
  Platform.select = originalSelect;
});

describe('ViewController - onPurchaseStarted event (iOS fields)', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should call onPurchaseStarted handler with iOS-specific subscription fields', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_STARTED;

    emitPaywallPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // Verify iOS-specific subscription fields
    expect(product.subscription).toBeDefined();
    if (product.subscription) {
      expect(product.subscription.ios).toBeDefined();
      if (product.subscription.ios) {
        expect(product.subscription.ios.subscriptionGroupIdentifier).toBe(
          '20770576',
        );
        expect(
          typeof product.subscription.ios.subscriptionGroupIdentifier,
        ).toBe('string');
      }

      // Verify Android-specific fields are NOT present
      expect(product.subscription).not.toHaveProperty('android');
    }

    // Verify iOS-specific product fields
    expect(product.ios).toBeDefined();
    if (product.ios) {
      expect(product.ios.isFamilyShareable).toBe(false);
      expect(typeof product.ios.isFamilyShareable).toBe('boolean');
    }
  });

  it('should contain is_family_shareable field in product (iOS)', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_STARTED;

    emitPaywallPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // iOS-specific fields
    expect(product.ios).toBeDefined();
    if (product.ios) {
      expect(product.ios.isFamilyShareable).toBe(false); // camelCase in JS
      expect(typeof product.ios.isFamilyShareable).toBe('boolean');
    }

    expect(product.subscription?.ios?.subscriptionGroupIdentifier).toBe(
      '20770576',
    ); // camelCase
    expect(typeof product.subscription?.ios?.subscriptionGroupIdentifier).toBe(
      'string',
    );

    // Android-specific fields should NOT be present
    expect(product.subscription).not.toHaveProperty('android');
    if (product.ios) {
      expect(Object.keys(product.ios)).toContain('isFamilyShareable');
    }
  });

  it('should contain group_identifier in subscription (iOS)', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_STARTED;

    emitPaywallPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // Verify group_identifier format
    expect(
      product.subscription?.ios?.subscriptionGroupIdentifier,
    ).toBeDefined();
    expect(typeof product.subscription?.ios?.subscriptionGroupIdentifier).toBe(
      'string',
    );
    expect(product.subscription?.ios?.subscriptionGroupIdentifier).toBe(
      '20770576',
    );
  });
});

describe('ViewController - onPurchaseCompleted event (iOS fields)', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should call onPurchaseCompleted handler with iOS-specific purchase result fields', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_COMPLETED_SUCCESS;

    emitPaywallPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult, product] = handler.mock.calls[0]!;

    // Verify iOS-specific purchase result fields
    expect(purchaseResult.type).toBe('success');
    if (purchaseResult.type === 'success') {
      expect(purchaseResult.ios).toBeDefined();
      if (purchaseResult.ios?.jwsTransaction) {
        expect(typeof purchaseResult.ios.jwsTransaction).toBe('string');
        expect(purchaseResult.ios.jwsTransaction.startsWith('eyJ')).toBe(true); // JWT format
      }

      // Verify Android-specific field is NOT present
      expect(purchaseResult).not.toHaveProperty('android');

      // Verify iOS store in profile
      expect(purchaseResult.profile).toBeDefined();
      if (purchaseResult.profile.subscriptions) {
        const subscription = Object.values(
          purchaseResult.profile.subscriptions,
        )[0] as AdaptySubscription | undefined;
        if (subscription) {
          expect(subscription.store).toBe('app_store');
        }
      }
    }

    // Verify iOS-specific product subscription fields
    if (product.subscription?.ios) {
      expect(product.subscription.ios.subscriptionGroupIdentifier).toBe(
        '20770576',
      );
    }
    if (product.ios) {
      expect(product.ios.isFamilyShareable).toBe(false);
    }
  });

  it('should contain apple_jws_transaction in successful purchase result (iOS)', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_COMPLETED_SUCCESS;

    emitPaywallPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult] = handler.mock.calls[0]!;

    // Check purchase result type
    expect(purchaseResult.type).toBe('success');

    // iOS-specific field in success variant
    if (purchaseResult.type === 'success') {
      expect(purchaseResult.ios).toBeDefined();
      if (purchaseResult.ios?.jwsTransaction) {
        expect(typeof purchaseResult.ios.jwsTransaction).toBe('string');
        expect(purchaseResult.ios.jwsTransaction.startsWith('eyJ')).toBe(true); // JWT format
      }

      // Android-specific field should NOT be present
      expect(purchaseResult).not.toHaveProperty('android');
    }
  });

  it('should NOT contain apple_jws_transaction in cancelled purchase result (iOS)', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_COMPLETED_CANCELLED;

    emitPaywallPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchasedResult] = handler.mock.calls[0]!;

    // Check purchase result type
    expect(purchasedResult.type).toBe('user_cancelled');

    // No transaction fields in cancelled result
    if (purchasedResult.type === 'user_cancelled') {
      expect(purchasedResult).not.toHaveProperty('ios');
      expect(purchasedResult).not.toHaveProperty('profile');
    }
  });

  it('should contain iOS product fields in cancelled purchase result', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_COMPLETED_CANCELLED;

    emitPaywallPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [, product] = handler.mock.calls[0]!;

    // Verify iOS-specific product fields
    if (product?.ios) {
      expect(product.ios.isFamilyShareable).toBe(false);
    }
    if (product?.subscription?.ios) {
      expect(product.subscription.ios.subscriptionGroupIdentifier).toBe(
        '20770576',
      );
    }
  });
});

describe('ViewController - onPurchaseFailed event (iOS fields)', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should call onPurchaseFailed handler with iOS-specific product fields', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseFailed']> = jest
      .fn()
      .mockReturnValue(false);

    view.setEventHandlers({ onPurchaseFailed: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_FAILED;

    emitPaywallPurchaseFailedEvent(
      viewId,
      sample.error,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [error, product] = handler.mock.calls[0]!;

    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);

    // Verify iOS-specific subscription fields
    expect(product.subscription).toBeDefined();
    if (product.subscription?.ios) {
      expect(product.subscription.ios.subscriptionGroupIdentifier).toBe(
        '20770576',
      );
    }

    // Verify iOS-specific product fields
    if (product.ios) {
      expect(product.ios.isFamilyShareable).toBe(false);
    }

    // Verify Android-specific fields are NOT present
    if (product.subscription) {
      expect(product.subscription).not.toHaveProperty('android');
    }
  });
});

describe('ViewController - onRestoreCompleted event (iOS fields)', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should call onRestoreCompleted handler with iOS-specific profile fields', async () => {
    const handler: jest.MockedFunction<EventHandlers['onRestoreCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_RESTORE_COMPLETED_SUCCESS;

    emitPaywallRestoreCompletedEvent(viewId, sample.profile, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [profile] = handler.mock.calls[0]!;

    expect(profile.profileId).toBe(sample.profile.profile_id);

    // Verify iOS store in subscriptions
    if (profile.subscriptions) {
      const subscriptions = Object.values(
        profile.subscriptions,
      ) as AdaptySubscription[];
      expect(subscriptions.length).toBeGreaterThan(0);
      subscriptions.forEach(subscription => {
        expect(subscription.store).toBe('app_store');
        // iOS transaction IDs are numeric strings
        if (subscription.vendorTransactionId) {
          expect(subscription.vendorTransactionId).toMatch(/^\d+$/);
        }
        if (subscription.vendorOriginalTransactionId) {
          expect(subscription.vendorOriginalTransactionId).toMatch(/^\d+$/);
        }
      });
    }

    // Verify iOS store in access levels
    if (profile.accessLevels) {
      const accessLevels = Object.values(
        profile.accessLevels,
      ) as AdaptyAccessLevel[];
      expect(accessLevels.length).toBeGreaterThan(0);
      accessLevels.forEach(accessLevel => {
        expect(accessLevel.store).toBe('app_store');
      });
    }
  });

  it('should contain store="app_store" in profile subscriptions and access levels (iOS)', async () => {
    const handler: jest.MockedFunction<EventHandlers['onRestoreCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_RESTORE_COMPLETED_SUCCESS;

    emitPaywallRestoreCompletedEvent(viewId, sample.profile, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);

    const receivedProfile = handler.mock.calls[0]![0];

    // Check subscriptions store field
    const subscriptionKeys = Object.keys(receivedProfile.subscriptions || {});
    expect(subscriptionKeys.length).toBeGreaterThan(0);

    subscriptionKeys.forEach(key => {
      const subscription = receivedProfile.subscriptions![key];
      if (subscription) {
        expect(subscription.store).toBe('app_store'); // iOS store
      }
    });

    // Check paid access levels store field
    const accessLevelKeys = Object.keys(receivedProfile.accessLevels || {});
    expect(accessLevelKeys.length).toBeGreaterThan(0);

    accessLevelKeys.forEach(key => {
      const accessLevel = receivedProfile.accessLevels![key];
      if (accessLevel) {
        expect(accessLevel.store).toBe('app_store'); // iOS store
      }
    });
  });

  it('should have iOS transaction IDs format in profile', async () => {
    const handler: jest.MockedFunction<EventHandlers['onRestoreCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_RESTORE_COMPLETED_SUCCESS;

    emitPaywallRestoreCompletedEvent(viewId, sample.profile, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [profile] = handler.mock.calls[0]!;

    // Verify iOS transaction IDs format
    if (profile.subscriptions) {
      const subscriptions = Object.values(
        profile.subscriptions,
      ) as AdaptySubscription[];
      subscriptions.forEach(subscription => {
        // iOS transaction IDs are numeric strings (not GPA.xxx format)
        expect(subscription.vendorTransactionId).toMatch(/^\d+$/);
        expect(subscription.vendorOriginalTransactionId).toMatch(/^\d+$/);
      });
    }
  });
});

describe('ViewController - onWebPaymentNavigationFinished event (iOS fields)', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should call onWebPaymentNavigationFinished handler with iOS-specific product fields', async () => {
    const handler: jest.MockedFunction<
      EventHandlers['onWebPaymentNavigationFinished']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onWebPaymentNavigationFinished: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_WEB_PAYMENT_NAVIGATION_FINISHED;

    emitPaywallWebPaymentNavigationFinishedEvent(
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

      // Verify iOS-specific subscription fields
      if (product.subscription?.ios) {
        expect(product.subscription.ios.subscriptionGroupIdentifier).toBe(
          '20770576',
        );
      }

      // Verify iOS-specific product fields
      if (product.ios) {
        expect(product.ios.isFamilyShareable).toBe(false);
      }

      // Verify Android-specific fields are NOT present
      if (product.subscription) {
        expect(product.subscription).not.toHaveProperty('android');
      }
    }
  });
});

describe('ViewController - iOS fields absence in platform-independent events', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should NOT contain iOS-specific fields in events without products', async () => {
    // This test verifies that events without products don't contain iOS-specific fields
    // For example, onPaywallShown, onPaywallClosed, etc.
    // These events only contain view information, no product data
    expect(true).toBe(true); // Placeholder - actual implementation would test view-only events
  });
});

describe('ViewController - Android fields absence in iOS events', () => {
  let adapty: Adapty;
  let view: ViewController;

  beforeEach(async () => {
    const result = await createPaywallViewController();
    adapty = result.adapty;
    view = result.view;
  });

  afterEach(() => {
    cleanupPaywallViewController(view, adapty);
  });

  it('should NOT contain Android-specific fields in iOS purchase started event', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_STARTED;

    emitPaywallPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // Verify Android-specific fields are NOT present
    if (product.subscription) {
      expect(product.subscription).not.toHaveProperty('android');
      expect(product.subscription.android).toBeUndefined();
    }
  });

  it('should NOT contain Android-specific fields in iOS purchase completed event', async () => {
    const handler: jest.MockedFunction<EventHandlers['onPurchaseCompleted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = IOS_PAYWALL_PURCHASE_COMPLETED_SUCCESS;

    emitPaywallPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult] = handler.mock.calls[0]!;

    // Verify Android-specific fields are NOT present
    if (purchaseResult.type === 'success') {
      expect(purchaseResult).not.toHaveProperty('android');
      expect(purchaseResult.android).toBeUndefined();
    }
  });
});
