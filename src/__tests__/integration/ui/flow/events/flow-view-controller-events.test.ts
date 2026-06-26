/**
 * Integration tests for FlowViewController events
 *
 * This file contains tests for platform-independent fields only.
 * Platform-specific fields are tested in separate files:
 * - ios-flow-view-controller-events.test.ts - iOS-specific fields (isFamilyShareable, subscriptionGroupIdentifier, appleJwsTransaction)
 * - android-flow-view-controller-events.test.ts - Android-specific fields (basePlanId, renewalType, googlePurchaseToken)
 *
 * Platform-independent fields tested here:
 * - Product: vendorProductId, adaptyId, localizedTitle, localizedDescription, price, subscription.period
 * - PurchaseResult: type, profile (structure only)
 * - Profile: profileId, subscriptions (structure only, not store values), accessLevels (structure only, not store values)
 * - Error: adaptyCode, message
 */

import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import { FlowViewController } from '@/ui/flow-view-controller';
import { FlowEventHandlers } from '@/ui/types';
import { $bridge } from '@/bridge';
import {
  createFlowViewController,
  cleanupFlowViewController,
} from '../../setup.utils';
import {
  emitFlowProductSelectedEvent,
  emitFlowUserActionEvent,
  emitFlowPurchaseStartedEvent,
  emitFlowPurchaseCompletedEvent,
  emitFlowPurchaseFailedEvent,
  emitFlowRestoreStartedEvent,
  emitFlowRestoreCompletedEvent,
  emitFlowRestoreFailedEvent,
  emitFlowViewAppearedEvent,
  emitFlowViewDisappearedEvent,
  emitFlowWebPaymentNavigationFinishedEvent,
  emitFlowRenderingFailedEvent,
  emitFlowLoadingProductsFailedEvent,
  emitFlowAnalyticEvent,
  emitFlowAppReviewEvent,
  emitFlowAskPermissionEvent,
} from './flow-event-emitter.utils';
import {
  FLOW_PRODUCT_SELECTED_YEARLY,
  FLOW_USER_ACTION_CLOSE,
  FLOW_USER_ACTION_OPEN_URL,
  FLOW_USER_ACTION_SYSTEM_BACK,
  FLOW_USER_ACTION_CLOSE_BUTTON,
  FLOW_PURCHASE_STARTED,
  FLOW_PURCHASE_COMPLETED_SUCCESS,
  FLOW_PURCHASE_COMPLETED_CANCELLED,
  FLOW_PURCHASE_FAILED,
  FLOW_RESTORE_STARTED,
  FLOW_RESTORE_COMPLETED_SUCCESS,
  FLOW_RESTORE_FAILED,
  FLOW_VIEW_APPEARED,
  FLOW_VIEW_DISAPPEARED,
  FLOW_WEB_PAYMENT_NAVIGATION_FINISHED,
  FLOW_RENDERING_FAILED,
  FLOW_LOADING_PRODUCTS_FAILED,
  FLOW_ANALYTIC_EVENT,
  FLOW_APP_REVIEW_REQUEST,
} from './flow-bridge-event-samples';

describe('FlowViewController - action mapping isolation', () => {
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

  it('should call ONLY onCloseButtonPress when action.type is "close"', async () => {
    // Register all 4 handlers for the same native event
    const onCloseHandler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(false);
    const onSystemBackHandler: jest.MockedFunction<
      FlowEventHandlers['onAndroidSystemBack']
    > = jest.fn().mockReturnValue(false);
    const onUrlPressHandler: jest.MockedFunction<
      FlowEventHandlers['onUrlPress']
    > = jest.fn().mockReturnValue(false);
    const onCustomHandler: jest.MockedFunction<
      FlowEventHandlers['onCustomAction']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onCloseButtonPress: onCloseHandler,
      onAndroidSystemBack: onSystemBackHandler,
      onUrlPress: onUrlPressHandler,
      onCustomAction: onCustomHandler,
    });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE;

    // Emit event with action.type = 'close'
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    // ONLY onCloseButtonPress should be called
    expect(onCloseHandler).toHaveBeenCalledTimes(1);

    // Others should NOT be called
    expect(onSystemBackHandler).not.toHaveBeenCalled();
    expect(onUrlPressHandler).not.toHaveBeenCalled();
    expect(onCustomHandler).not.toHaveBeenCalled();
  });

  it('should call ONLY onUrlPress when action.type is "open_url"', async () => {
    const onCloseHandler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(false);
    const onUrlPressHandler: jest.MockedFunction<
      FlowEventHandlers['onUrlPress']
    > = jest.fn().mockReturnValue(false);
    const onCustomHandler: jest.MockedFunction<
      FlowEventHandlers['onCustomAction']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onCloseButtonPress: onCloseHandler,
      onUrlPress: onUrlPressHandler,
      onCustomAction: onCustomHandler,
    });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_OPEN_URL;

    // Emit event with action.type = 'open_url' and value = URL
    emitFlowUserActionEvent(
      viewId,
      'open_url',
      sample.action.value,
      sample.view,
      sample.action.open_in,
    );

    // ONLY onUrlPress should be called with URL + openIn
    expect(onUrlPressHandler).toHaveBeenCalledTimes(1);
    expect(onUrlPressHandler).toHaveBeenCalledWith(
      sample.action.value,
      sample.action.open_in,
    );

    // Others should NOT be called
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onCustomHandler).not.toHaveBeenCalled();
  });

  it('should call ONLY onAndroidSystemBack when action.type is "system_back"', async () => {
    const onCloseHandler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(false);
    const onSystemBackHandler: jest.MockedFunction<
      FlowEventHandlers['onAndroidSystemBack']
    > = jest.fn().mockReturnValue(false);
    const onUrlPressHandler: jest.MockedFunction<
      FlowEventHandlers['onUrlPress']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onCloseButtonPress: onCloseHandler,
      onAndroidSystemBack: onSystemBackHandler,
      onUrlPress: onUrlPressHandler,
    });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_SYSTEM_BACK;

    // Emit event with action.type = 'system_back'
    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    // ONLY onAndroidSystemBack should be called
    expect(onSystemBackHandler).toHaveBeenCalledTimes(1);

    // Others should NOT be called
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onUrlPressHandler).not.toHaveBeenCalled();
  });

  it('should call ONLY onCustomAction when action.type is "custom"', async () => {
    const onCloseHandler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(false);
    const onCustomHandler: jest.MockedFunction<
      FlowEventHandlers['onCustomAction']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onCloseButtonPress: onCloseHandler,
      onCustomAction: onCustomHandler,
    });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE; // Reuse sample but change action type

    // Emit event with action.type = 'custom' and custom value
    emitFlowUserActionEvent(
      viewId,
      'custom',
      'custom_action_value',
      sample.view,
    );

    // ONLY onCustomAction should be called with the value
    expect(onCustomHandler).toHaveBeenCalledTimes(1);
    expect(onCustomHandler).toHaveBeenCalledWith('custom_action_value');

    // onCloseButtonPress should NOT be called
    expect(onCloseHandler).not.toHaveBeenCalled();
  });

  it('should call onAnalytics with name and params', () => {
    const onAnalytics: jest.MockedFunction<FlowEventHandlers['onAnalytics']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onAnalytics });

    const viewId = (view as any).id;
    const sample = FLOW_ANALYTIC_EVENT;

    emitFlowAnalyticEvent(viewId, sample.name, sample.params, sample.view);

    expect(onAnalytics).toHaveBeenCalledTimes(1);
    expect(onAnalytics).toHaveBeenCalledWith(sample.name, sample.params);
  });

  it('should call onRequestAppReview with no arguments', () => {
    const onRequestAppReview: jest.MockedFunction<
      FlowEventHandlers['onRequestAppReview']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRequestAppReview });

    const viewId = (view as any).id;
    const sample = FLOW_APP_REVIEW_REQUEST;

    emitFlowAppReviewEvent(viewId, sample.view);

    expect(onRequestAppReview).toHaveBeenCalledTimes(1);
    expect(onRequestAppReview).toHaveBeenCalledWith();
  });

  it('invokes onRequestPermission and replies to native with the resolved status', async () => {
    const requestSpy = jest
      .spyOn(($bridge as any).testBridge, 'request')
      .mockResolvedValue(undefined);

    const onRequestPermission: jest.MockedFunction<
      FlowEventHandlers['onRequestPermission']
    > = jest.fn().mockResolvedValue({ status: 'granted', detail: 'authorized' });

    view.setEventHandlers({ onRequestPermission });

    const viewId = (view as any).id;
    emitFlowAskPermissionEvent(
      viewId,
      'evt-1',
      'notifications',
      { source: 'onboarding' },
      { id: viewId, placement_id: 'plc', variation_id: 'var' },
    );

    // Handler receives (permission, customArgs); event id is hidden.
    expect(onRequestPermission).toHaveBeenCalledWith('notifications', {
      source: 'onboarding',
    });

    // Flush the async round-trip microtasks.
    await new Promise(resolve => setImmediate(resolve));

    const responseCall = requestSpy.mock.calls.find(
      call => call[0] === 'flow_view_did_answer_permission',
    );
    expect(responseCall).toBeDefined();
    expect(responseCall![2]).toBe('Void');

    const body = JSON.parse(responseCall![1] as string);
    expect(body).toMatchObject({
      method: 'flow_view_did_answer_permission',
      event_id: 'evt-1',
      status: 'granted',
      detail: 'authorized',
    });

    requestSpy.mockRestore();
  });

  it('replies with unavailable when onRequestPermission rejects', async () => {
    const requestSpy = jest
      .spyOn(($bridge as any).testBridge, 'request')
      .mockResolvedValue(undefined);

    // The rejected handler is logged via log.failed -> console.error by design;
    // silence the expected error so it doesn't pollute the test output.
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const onRequestPermission: jest.MockedFunction<
      FlowEventHandlers['onRequestPermission']
    > = jest.fn().mockRejectedValue(new Error('boom'));

    view.setEventHandlers({ onRequestPermission });

    const viewId = (view as any).id;
    emitFlowAskPermissionEvent(
      viewId,
      'evt-err',
      'notifications',
      {},
      { id: viewId, placement_id: 'plc', variation_id: 'var' },
    );

    await new Promise(resolve => setImmediate(resolve));

    const responseCall = requestSpy.mock.calls.find(
      call => call[0] === 'flow_view_did_answer_permission',
    );
    expect(responseCall).toBeDefined();
    const body = JSON.parse(responseCall![1] as string);
    expect(body).toMatchObject({
      method: 'flow_view_did_answer_permission',
      event_id: 'evt-err',
      status: 'unavailable',
    });

    requestSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe('FlowViewController - onProductSelected event', () => {
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

  it('should call onProductSelected handler when product is selected', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onProductSelected']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onProductSelected: handler });

    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(sample.product_id);
  });

  it('should filter events by viewId', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onProductSelected']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onProductSelected: handler });

    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Emit event for DIFFERENT view
    emitFlowProductSelectedEvent(
      'different_view_id',
      sample.product_id,
      sample.view,
    );

    // Handler should NOT be called
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('FlowViewController - onPurchaseStarted event', () => {
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

  it('should call onPurchaseStarted handler when purchase starts', async () => {
    // NOTE: This test verifies platform-independent fields only.
    // Platform-specific fields (iOS: isFamilyShareable, subscriptionGroupIdentifier;
    // Android: basePlanId, renewalType) are tested in platform-specific test files.
    const handler: jest.MockedFunction<FlowEventHandlers['onPurchaseStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseStarted: handler });

    const viewId = (view as any).id;
    const sample = FLOW_PURCHASE_STARTED;

    emitFlowPurchaseStartedEvent(viewId, sample.product, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [product] = handler.mock.calls[0]!;

    // Platform-independent product fields
    expect(product).toHaveProperty(
      'vendorProductId',
      sample.product.vendor_product_id,
    );
    expect(product).toHaveProperty(
      'adaptyId',
      sample.product.adapty_product_id,
    );
    expect(product).toHaveProperty(
      'localizedTitle',
      sample.product.localized_title,
    );
    expect(product).toHaveProperty(
      'localizedDescription',
      sample.product.localized_description,
    );
    expect(product).toHaveProperty(
      'accessLevelId',
      sample.product.access_level_id,
    );
    expect(product).toHaveProperty('productType', sample.product.product_type);

    // Platform-independent price fields
    expect(product).toHaveProperty('price');
    expect(product.price).toHaveProperty('amount', sample.product.price.amount);
    expect(product.price).toHaveProperty(
      'currencyCode',
      sample.product.price.currency_code,
    );
    expect(product.price).toHaveProperty(
      'currencySymbol',
      sample.product.price.currency_symbol,
    );
    expect(product.price).toHaveProperty(
      'localizedString',
      sample.product.price.localized_string,
    );

    // Platform-independent subscription fields
    if (product.subscription) {
      expect(product.subscription).toHaveProperty('subscriptionPeriod');
      expect(product.subscription.subscriptionPeriod).toHaveProperty(
        'unit',
        sample.product.subscription.period.unit,
      );
      expect(product.subscription.subscriptionPeriod).toHaveProperty(
        'numberOfUnits',
        sample.product.subscription.period.number_of_units,
      );
      expect(product.subscription).toHaveProperty(
        'localizedSubscriptionPeriod',
        sample.product.subscription.localized_period,
      );
    }
  });
});

describe('FlowViewController - onPurchaseCompleted event', () => {
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

  it('should call onPurchaseCompleted handler with success result', async () => {
    // NOTE: This test verifies platform-independent fields only.
    // Platform-specific fields (iOS: appleJwsTransaction; Android: googlePurchaseToken)
    // are tested in platform-specific test files.
    const handler: jest.MockedFunction<
      FlowEventHandlers['onPurchaseCompleted']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = FLOW_PURCHASE_COMPLETED_SUCCESS;

    emitFlowPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult, product] = handler.mock.calls[0]!;

    // Platform-independent purchase result fields
    expect(purchaseResult.type).toBe('success');
    if (purchaseResult.type === 'success') {
      expect(purchaseResult).toHaveProperty('profile');
      expect(purchaseResult.profile).toHaveProperty('profileId');
      expect(purchaseResult.profile).toHaveProperty('subscriptions');
      expect(purchaseResult.profile).toHaveProperty('accessLevels');
    }

    // Platform-independent product fields
    expect(product).toHaveProperty(
      'vendorProductId',
      sample.product.vendor_product_id,
    );
    expect(product).toHaveProperty(
      'adaptyId',
      sample.product.adapty_product_id,
    );
    expect(product).toHaveProperty(
      'localizedTitle',
      sample.product.localized_title,
    );
    expect(product).toHaveProperty(
      'localizedDescription',
      sample.product.localized_description,
    );
  });

  it('should call onPurchaseCompleted handler with user_cancelled result', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onPurchaseCompleted']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseCompleted: handler });

    const viewId = (view as any).id;
    const sample = FLOW_PURCHASE_COMPLETED_CANCELLED;

    emitFlowPurchaseCompletedEvent(
      viewId,
      sample.purchased_result,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [purchaseResult] = handler.mock.calls[0]!;
    expect(purchaseResult).toHaveProperty('type', 'user_cancelled');
  });
});

describe('FlowViewController - onPurchaseFailed event', () => {
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

  it('should call onPurchaseFailed handler when purchase fails', async () => {
    // NOTE: This test verifies platform-independent fields only.
    // Platform-specific product fields are tested in platform-specific test files.
    const handler: jest.MockedFunction<FlowEventHandlers['onPurchaseFailed']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onPurchaseFailed: handler });

    const viewId = (view as any).id;
    const sample = FLOW_PURCHASE_FAILED;

    emitFlowPurchaseFailedEvent(
      viewId,
      sample.error,
      sample.product,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [error, product] = handler.mock.calls[0]!;

    // Platform-independent error fields
    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);
    expect(error).toHaveProperty('message');

    // Platform-independent product fields
    expect(product).toHaveProperty(
      'vendorProductId',
      sample.product.vendor_product_id,
    );
    expect(product).toHaveProperty(
      'adaptyId',
      sample.product.adapty_product_id,
    );
    expect(product).toHaveProperty(
      'localizedTitle',
      sample.product.localized_title,
    );
    expect(product).toHaveProperty(
      'localizedDescription',
      sample.product.localized_description,
    );
  });
});

describe('FlowViewController - onRestoreStarted event', () => {
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

  it('should call onRestoreStarted handler when restore starts', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onRestoreStarted']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreStarted: handler });

    const viewId = (view as any).id;
    const sample = FLOW_RESTORE_STARTED;

    emitFlowRestoreStartedEvent(viewId, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });
});

describe('FlowViewController - onRestoreCompleted event', () => {
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

  it('should call onRestoreCompleted handler with profile', async () => {
    // NOTE: This test verifies platform-independent fields only.
    // Platform-specific fields (store: "app_store" vs "play_store", transaction ID formats)
    // are tested in platform-specific test files.
    const handler: jest.MockedFunction<
      FlowEventHandlers['onRestoreCompleted']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreCompleted: handler });

    const viewId = (view as any).id;
    const sample = FLOW_RESTORE_COMPLETED_SUCCESS;

    emitFlowRestoreCompletedEvent(viewId, sample.profile, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [profile] = handler.mock.calls[0]!;

    // Platform-independent profile fields
    expect(profile).toHaveProperty('profileId', sample.profile.profile_id);
    expect(profile).toHaveProperty('subscriptions');
    expect(profile).toHaveProperty('accessLevels');

    // Platform-independent subscription fields (structure only, not store-specific values)
    if (profile.subscriptions) {
      const subscription = Object.values(profile.subscriptions)[0];
      expect(subscription).toHaveProperty('vendorProductId');
      expect(subscription).toHaveProperty('isActive');
      expect(subscription).toHaveProperty('activatedAt');
      expect(subscription).toHaveProperty('store'); // Only check presence, not value
    }

    // Platform-independent access level fields (structure only, not store-specific values)
    if (profile.accessLevels) {
      const accessLevel = Object.values(profile.accessLevels)[0];
      expect(accessLevel).toHaveProperty('id');
      expect(accessLevel).toHaveProperty('isActive');
      expect(accessLevel).toHaveProperty('vendorProductId');
      expect(accessLevel).toHaveProperty('store'); // Only check presence, not value
    }
  });
});

describe('FlowViewController - onRestoreFailed event', () => {
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

  it('should call onRestoreFailed handler when restore fails', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onRestoreFailed']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onRestoreFailed: handler });

    const viewId = (view as any).id;
    const sample = FLOW_RESTORE_FAILED;

    emitFlowRestoreFailedEvent(viewId, sample.error, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [error] = handler.mock.calls[0]!;
    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);
  });
});

describe('FlowViewController - onCloseButtonPress event', () => {
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

  it('should call onCloseButtonPress handler when close button is pressed', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onCloseButtonPress: handler });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE_BUTTON;

    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });
});

describe('FlowViewController - onAndroidSystemBack event', () => {
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
    const sample = FLOW_USER_ACTION_SYSTEM_BACK;

    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });
});

describe('FlowViewController - onUrlPress event', () => {
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

  it('should call onUrlPress handler with URL when URL is pressed', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onUrlPress']> = jest
      .fn()
      .mockReturnValue(false);

    view.setEventHandlers({ onUrlPress: handler });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_OPEN_URL;

    emitFlowUserActionEvent(
      viewId,
      'open_url',
      sample.action.value,
      sample.view,
      sample.action.open_in,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      sample.action.value,
      sample.action.open_in,
    );
  });
});

describe('FlowViewController - onCustomAction event', () => {
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

  it('should call onCustomAction handler with action value', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onCustomAction']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onCustomAction: handler });

    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE; // Reuse sample

    const customValue = 'my_custom_action';
    emitFlowUserActionEvent(viewId, 'custom', customValue, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(customValue);
  });
});

describe('FlowViewController - onAppeared event', () => {
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

  it('should call onAppeared handler when flow appears', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onAppeared']> = jest
      .fn()
      .mockReturnValue(false);

    view.setEventHandlers({ onAppeared: handler });

    const viewId = (view as any).id;
    const sample = FLOW_VIEW_APPEARED;

    emitFlowViewAppearedEvent(viewId, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });
});

describe('FlowViewController - onDisappeared event', () => {
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

  it('should call onDisappeared handler when flow disappears', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onDisappeared']> =
      jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onDisappeared: handler });

    const viewId = (view as any).id;
    const sample = FLOW_VIEW_DISAPPEARED;

    emitFlowViewDisappearedEvent(viewId, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith();
  });
});

describe('FlowViewController - onError event', () => {
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

  it('should call onError handler when rendering fails', async () => {
    const handler: jest.MockedFunction<FlowEventHandlers['onError']> = jest
      .fn()
      .mockReturnValue(false);

    view.setEventHandlers({ onError: handler });

    const viewId = (view as any).id;
    const sample = FLOW_RENDERING_FAILED;

    emitFlowRenderingFailedEvent(viewId, sample.error, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [error] = handler.mock.calls[0]!;
    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);
  });
});

describe('FlowViewController - onLoadingProductsFailed event', () => {
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

  it('should call onLoadingProductsFailed handler when loading products fails', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onLoadingProductsFailed']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onLoadingProductsFailed: handler });

    const viewId = (view as any).id;
    const sample = FLOW_LOADING_PRODUCTS_FAILED;

    emitFlowLoadingProductsFailedEvent(viewId, sample.error, sample.view);

    expect(handler).toHaveBeenCalledTimes(1);
    const [error] = handler.mock.calls[0]!;
    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(sample.error.adapty_code);
  });
});

describe('FlowViewController - onWebPaymentNavigationFinished event', () => {
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

  it('should call onWebPaymentNavigationFinished handler with product', async () => {
    // NOTE: This test verifies platform-independent fields only.
    // Platform-specific product fields are tested in platform-specific test files.
    const handler: jest.MockedFunction<
      FlowEventHandlers['onWebPaymentNavigationFinished']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onWebPaymentNavigationFinished: handler });

    const viewId = (view as any).id;
    const sample = FLOW_WEB_PAYMENT_NAVIGATION_FINISHED;

    emitFlowWebPaymentNavigationFinishedEvent(
      viewId,
      sample.product,
      undefined,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [product, error] = handler.mock.calls[0]!;

    // Platform-independent product fields
    expect(product).toBeDefined();
    if (product) {
      expect(product).toHaveProperty(
        'vendorProductId',
        sample.product.vendor_product_id,
      );
      expect(product).toHaveProperty(
        'adaptyId',
        sample.product.adapty_product_id,
      );
      expect(product).toHaveProperty(
        'localizedTitle',
        sample.product.localized_title,
      );
      expect(product).toHaveProperty(
        'localizedDescription',
        sample.product.localized_description,
      );
      expect(product).toHaveProperty('price');
      if (product.price) {
        expect(product.price).toHaveProperty(
          'amount',
          sample.product.price.amount,
        );
        expect(product.price).toHaveProperty(
          'currencyCode',
          sample.product.price.currency_code,
        );
      }

      // Platform-independent subscription fields
      if (product.subscription) {
        expect(product.subscription).toHaveProperty('subscriptionPeriod');
        expect(product.subscription.subscriptionPeriod).toHaveProperty(
          'unit',
          sample.product.subscription.period.unit,
        );
        expect(product.subscription.subscriptionPeriod).toHaveProperty(
          'numberOfUnits',
          sample.product.subscription.period.number_of_units,
        );
      }
    }

    expect(error).toBeUndefined();
  });

  it('should call onWebPaymentNavigationFinished handler with error', async () => {
    const handler: jest.MockedFunction<
      FlowEventHandlers['onWebPaymentNavigationFinished']
    > = jest.fn().mockReturnValue(false);

    view.setEventHandlers({ onWebPaymentNavigationFinished: handler });

    const viewId = (view as any).id;
    const sample = FLOW_WEB_PAYMENT_NAVIGATION_FINISHED;

    const mockError = { adapty_code: 999, message: 'Web payment error' };
    emitFlowWebPaymentNavigationFinishedEvent(
      viewId,
      undefined,
      mockError,
      sample.view,
    );

    expect(handler).toHaveBeenCalledTimes(1);
    const [product, error] = handler.mock.calls[0]!;
    expect(product).toBeUndefined();
    expect(error).toBeInstanceOf(AdaptyError);
  });
});

describe('FlowViewController - event viewId filtering', () => {
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

  it('should ignore events when viewId does not match', async () => {
    // Create mock handlers for all event types
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    const onPurchaseStartedHandler = jest.fn().mockReturnValue(false);
    const onPurchaseCompletedHandler = jest.fn().mockReturnValue(false);
    const onRestoreStartedHandler = jest.fn().mockReturnValue(false);
    const onCloseHandler = jest.fn().mockReturnValue(false);
    const onAppearedHandler = jest.fn().mockReturnValue(false);

    // Register all handlers
    view.setEventHandlers({
      onProductSelected: onProductSelectedHandler,
      onPurchaseStarted: onPurchaseStartedHandler,
      onPurchaseCompleted: onPurchaseCompletedHandler,
      onRestoreStarted: onRestoreStartedHandler,
      onCloseButtonPress: onCloseHandler,
      onAppeared: onAppearedHandler,
    });

    // Use a different viewId
    const wrongViewId = 'wrong_view_id_12345';
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Emit all event types with wrong viewId
    emitFlowProductSelectedEvent(wrongViewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      wrongViewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );
    emitFlowPurchaseCompletedEvent(
      wrongViewId,
      FLOW_PURCHASE_COMPLETED_SUCCESS.purchased_result,
      FLOW_PURCHASE_COMPLETED_SUCCESS.product,
      sample.view,
    );
    emitFlowRestoreStartedEvent(wrongViewId, sample.view);
    emitFlowUserActionEvent(wrongViewId, 'close', undefined, sample.view);
    emitFlowViewAppearedEvent(wrongViewId, sample.view);

    // Verify that NONE of the handlers were called
    expect(onProductSelectedHandler).not.toHaveBeenCalled();
    expect(onPurchaseStartedHandler).not.toHaveBeenCalled();
    expect(onPurchaseCompletedHandler).not.toHaveBeenCalled();
    expect(onRestoreStartedHandler).not.toHaveBeenCalled();
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onAppearedHandler).not.toHaveBeenCalled();
  });
});

describe('FlowViewController - multiple views isolation', () => {
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

  it('should isolate event handlers between view instances', async () => {
    // Create a second view using the SAME adapty instance.
    // We get flow2 directly from the existing adapty (re-creating it via
    // createFlowViewController would call createAdaptyInstance again and
    // reset the bridge, invalidating the first view's listeners).
    const flow2 = await adapty.getFlow('test_placement');
    const view2 = await (view.constructor as any).create(flow2, {});

    try {
      const viewId1 = (view as any).id;
      const viewId2 = (view2 as any).id;

      const sample = FLOW_PRODUCT_SELECTED_YEARLY;

      // Create handlers for both views
      const handler1 = jest.fn().mockReturnValue(false);
      const handler2 = jest.fn().mockReturnValue(false);

      // Register handlers on both views
      const unsubscribe1 = view.setEventHandlers({
        onProductSelected: handler1,
      });
      view2.setEventHandlers({ onProductSelected: handler2 });

      // Emit events to both views - both should receive
      emitFlowProductSelectedEvent(viewId1, sample.product_id, sample.view);
      emitFlowProductSelectedEvent(viewId2, sample.product_id, sample.view);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      // Clear mocks
      handler1.mockClear();
      handler2.mockClear();

      // Unsubscribe first view
      unsubscribe1();

      // Emit events again
      emitFlowProductSelectedEvent(viewId1, sample.product_id, sample.view);
      emitFlowProductSelectedEvent(viewId2, sample.product_id, sample.view);

      // First view should not receive (unsubscribed)
      expect(handler1).not.toHaveBeenCalled();
      // Second view should still receive (not affected by first view's unsubscribe)
      expect(handler2).toHaveBeenCalledTimes(1);
    } finally {
      // Cleanup second view
      // view2 cleanup happens through adapty.removeAllListeners
    }
  });
});

describe('FlowViewController - unsubscribe functionality', () => {
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

  it('should unsubscribe all handlers using returned unsubscribe function', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Set up multiple handlers
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    const onPurchaseStartedHandler = jest.fn().mockReturnValue(false);
    const onCloseHandler = jest.fn().mockReturnValue(false);

    const unsubscribe = view.setEventHandlers({
      onProductSelected: onProductSelectedHandler,
      onPurchaseStarted: onPurchaseStartedHandler,
      onCloseButtonPress: onCloseHandler,
    });

    // Emit events BEFORE unsubscribe - handlers should be called
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(onPurchaseStartedHandler).toHaveBeenCalledTimes(1);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);

    // Clear mocks
    onProductSelectedHandler.mockClear();
    onPurchaseStartedHandler.mockClear();
    onCloseHandler.mockClear();

    // Call unsubscribe
    unsubscribe();
    // Idempotency: second call should not throw
    expect(() => unsubscribe()).not.toThrow();

    // Emit events AFTER unsubscribe - handlers should NOT be called
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    expect(onProductSelectedHandler).not.toHaveBeenCalled();
    expect(onPurchaseStartedHandler).not.toHaveBeenCalled();
    expect(onCloseHandler).not.toHaveBeenCalled();
  });

  it('should allow re-subscribing after unsubscribe', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // First subscription
    const onProductSelectedHandler1 = jest.fn().mockReturnValue(false);
    const unsubscribe1 = view.setEventHandlers({
      onProductSelected: onProductSelectedHandler1,
    });

    // Emit event - should be handled
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler1).toHaveBeenCalledTimes(1);

    // Unsubscribe
    unsubscribe1();
    onProductSelectedHandler1.mockClear();

    // Emit event - should NOT be handled
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler1).not.toHaveBeenCalled();

    // Re-subscribe with new handler
    const onProductSelectedHandler2 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({
      onProductSelected: onProductSelectedHandler2,
    });

    // Emit event - new handler should be called
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler1).not.toHaveBeenCalled(); // Old handler still not called
    expect(onProductSelectedHandler2).toHaveBeenCalledTimes(1); // New handler called
  });
});

describe('FlowViewController - dismiss on handler return value', () => {
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

  it('should call dismiss when any handler returns true', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Test onProductSelected returning true
    const onProductSelectedHandler = jest.fn().mockReturnValue(true);
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    view.setEventHandlers({ onProductSelected: onProductSelectedHandler });
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onProductSelectedHandler.mockClear();
    dismissSpy.mockClear();

    // Test onCloseButtonPress returning true
    const onCloseHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onCloseButtonPress: onCloseHandler });
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // Reset
    onCloseHandler.mockClear();
    dismissSpy.mockClear();

    // Test onPurchaseCompleted returning true
    const onPurchaseCompletedHandler = jest.fn().mockReturnValue(true);
    view.setEventHandlers({ onPurchaseCompleted: onPurchaseCompletedHandler });
    emitFlowPurchaseCompletedEvent(
      viewId,
      FLOW_PURCHASE_COMPLETED_SUCCESS.purchased_result,
      FLOW_PURCHASE_COMPLETED_SUCCESS.product,
      sample.view,
    );
    expect(onPurchaseCompletedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should NOT call dismiss when handlers return false', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Test onProductSelected returning false
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler });
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onProductSelectedHandler.mockClear();

    // Test onCloseButtonPress returning false
    const onCloseHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onCloseButtonPress: onCloseHandler });
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });

  it('should NOT call dismiss when handlers return undefined', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Test onProductSelected returning undefined
    const onProductSelectedHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler });
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    onProductSelectedHandler.mockClear();

    // Test onRestoreStarted returning undefined
    const onRestoreStartedHandler = jest.fn().mockReturnValue(undefined);
    view.setEventHandlers({ onRestoreStarted: onRestoreStartedHandler });
    emitFlowRestoreStartedEvent(viewId, sample.view);
    expect(onRestoreStartedHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });
});

describe('FlowViewController - dismiss cleanup', () => {
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

  it('should unsubscribe all event listeners after dismiss', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Set up handlers for multiple event types
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    const onPurchaseStartedHandler = jest.fn().mockReturnValue(false);
    const onCloseHandler = jest.fn().mockReturnValue(false);
    const onRestoreStartedHandler = jest.fn().mockReturnValue(false);

    view.setEventHandlers({
      onProductSelected: onProductSelectedHandler,
      onPurchaseStarted: onPurchaseStartedHandler,
      onCloseButtonPress: onCloseHandler,
      onRestoreStarted: onRestoreStartedHandler,
    });

    // Emit events BEFORE dismiss - handlers should be called
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );

    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(onPurchaseStartedHandler).toHaveBeenCalledTimes(1);

    // Clear mock call history
    onProductSelectedHandler.mockClear();
    onPurchaseStartedHandler.mockClear();
    onCloseHandler.mockClear();
    onRestoreStartedHandler.mockClear();

    // Call dismiss
    await view.dismiss();

    // Emit onDisappeared event - this triggers cleanup via internal handler
    emitFlowViewDisappearedEvent(viewId, sample.view);

    // Emit events AFTER cleanup - handlers should NOT be called
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);
    emitFlowRestoreStartedEvent(viewId, sample.view);

    // Verify that NONE of the handlers were called after cleanup
    expect(onProductSelectedHandler).not.toHaveBeenCalled();
    expect(onPurchaseStartedHandler).not.toHaveBeenCalled();
    expect(onCloseHandler).not.toHaveBeenCalled();
    expect(onRestoreStartedHandler).not.toHaveBeenCalled();
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

describe('FlowViewController - default event handlers', () => {
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

  it('should auto-dismiss flow when onCloseButtonPress event is emitted with default handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE;

    // Spy on dismiss method to verify it's called
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Emit close event WITHOUT setting custom handler
    // Default handler (onCloseButtonPress: () => true) should be active from create()
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    // Verify dismiss was called due to default handler returning true
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should keep flow open when onAndroidSystemBack event is emitted with default handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_SYSTEM_BACK;

    // Spy on dismiss method to verify it's NOT called
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Emit system_back event WITHOUT setting custom handler
    // Default handler (onAndroidSystemBack: () => false) should be active from create()
    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    // Verify dismiss was NOT called because default handler returns false
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });

  it('should auto-dismiss flow when onError event is emitted with default handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_RENDERING_FAILED;

    // Spy on dismiss method to verify it's called
    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Emit rendering_failed event WITHOUT setting custom handler
    // Default handler (onError: () => true) should be active from create()
    emitFlowRenderingFailedEvent(viewId, sample.error, sample.view);

    // Verify dismiss was called due to default handler returning true
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });

  it('should allow overriding default onCloseButtonPress handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_CLOSE;

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Override default handler with one that returns false
    const customHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onCloseButtonPress: customHandler });

    // Emit close event
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    // Custom handler should be called
    expect(customHandler).toHaveBeenCalledTimes(1);

    // Dismiss should NOT be called because custom handler returned false
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });

  it('should allow overriding default onAndroidSystemBack handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_USER_ACTION_SYSTEM_BACK;

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Override default handler with one that returns false
    const customHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onAndroidSystemBack: customHandler });

    // Emit system_back event
    emitFlowUserActionEvent(viewId, 'system_back', undefined, sample.view);

    // Custom handler should be called
    expect(customHandler).toHaveBeenCalledTimes(1);

    // Dismiss should NOT be called because custom handler returned false
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });

  it('should allow overriding default onError handler', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_RENDERING_FAILED;

    const dismissSpy = jest.spyOn(view, 'dismiss').mockResolvedValue();

    // Override default handler with one that returns false
    const customHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onError: customHandler });

    // Emit rendering_failed event
    emitFlowRenderingFailedEvent(viewId, sample.error, sample.view);

    // Custom handler should be called
    expect(customHandler).toHaveBeenCalledTimes(1);

    // Dismiss should NOT be called because custom handler returned false
    expect(dismissSpy).not.toHaveBeenCalled();

    dismissSpy.mockRestore();
  });
});

describe('FlowViewController - setEventHandlers merge behavior', () => {
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

  it('should preserve previously set handlers when adding new ones', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Set first handler
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler });

    // Set second handler - onProductSelected should still be active
    const onPurchaseStartedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onPurchaseStarted: onPurchaseStartedHandler });

    // Emit events for both handlers
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );

    // Both handlers should have been called
    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(onProductSelectedHandler).toHaveBeenCalledWith(sample.product_id);
    expect(onPurchaseStartedHandler).toHaveBeenCalledTimes(1);
  });

  it('should replace handler when setting same event type again', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Set first onProductSelected handler
    const onProductSelectedHandler1 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler1 });

    // Replace with second onProductSelected handler
    const onProductSelectedHandler2 = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler2 });

    // Emit product selected event
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);

    // Only the second handler should be called
    expect(onProductSelectedHandler1).not.toHaveBeenCalled();
    expect(onProductSelectedHandler2).toHaveBeenCalledTimes(1);
    expect(onProductSelectedHandler2).toHaveBeenCalledWith(sample.product_id);
  });

  it('should preserve multiple handlers across successive setEventHandlers calls', async () => {
    const viewId = (view as any).id;
    const sample = FLOW_PRODUCT_SELECTED_YEARLY;

    // Set handlers one by one
    const onProductSelectedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onProductSelected: onProductSelectedHandler });

    const onPurchaseStartedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onPurchaseStarted: onPurchaseStartedHandler });

    const onRestoreStartedHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onRestoreStarted: onRestoreStartedHandler });

    const onCloseHandler = jest.fn().mockReturnValue(false);
    view.setEventHandlers({ onCloseButtonPress: onCloseHandler });

    // Emit all events
    emitFlowProductSelectedEvent(viewId, sample.product_id, sample.view);
    emitFlowPurchaseStartedEvent(
      viewId,
      FLOW_PURCHASE_STARTED.product,
      sample.view,
    );
    emitFlowRestoreStartedEvent(viewId, sample.view);
    emitFlowUserActionEvent(viewId, 'close', undefined, sample.view);

    // All handlers should have been called
    expect(onProductSelectedHandler).toHaveBeenCalledTimes(1);
    expect(onPurchaseStartedHandler).toHaveBeenCalledTimes(1);
    expect(onRestoreStartedHandler).toHaveBeenCalledTimes(1);
    expect(onCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe('FlowViewController - onDisappeared after user action close', () => {
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

  it('should call onDisappeared handler even after close button triggers dismiss', async () => {
    const viewId = (view as any).id;
    const closeButtonSample = FLOW_USER_ACTION_CLOSE_BUTTON;
    const closedSample = FLOW_VIEW_DISAPPEARED;

    // Set up handlers
    const onCloseButtonPressHandler: jest.MockedFunction<
      FlowEventHandlers['onCloseButtonPress']
    > = jest.fn().mockReturnValue(true); // Returns true to trigger dismiss
    const onDisappearedHandler: jest.MockedFunction<
      FlowEventHandlers['onDisappeared']
    > = jest.fn().mockReturnValue(false);

    // Spy on dismiss WITHOUT mocking - let it execute normally
    const dismissSpy = jest.spyOn(view, 'dismiss');

    view.setEventHandlers({
      onCloseButtonPress: onCloseButtonPressHandler,
      onDisappeared: onDisappearedHandler,
    });

    // 1. User presses close button - this should trigger dismiss
    emitFlowUserActionEvent(viewId, 'close', undefined, closeButtonSample.view);

    expect(onCloseButtonPressHandler).toHaveBeenCalledTimes(1);
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    // 2. Native code sends onDisappeared before dismiss resolves
    // (dismiss response is expected to be the last event)
    emitFlowViewDisappearedEvent(viewId, closedSample.view);

    // 3. Wait for dismiss to complete (includes cleanup)
    await dismissSpy.mock.results[0]?.value;

    // VERIFICATION: onDisappeared handler should be called
    expect(onDisappearedHandler).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });
});
