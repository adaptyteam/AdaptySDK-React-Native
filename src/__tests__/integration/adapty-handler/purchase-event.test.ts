/**
 * Integration test for purchase event handling
 *
 * Tests that onLatestProfileLoad event is emitted and correctly parsed after purchase.
 */

import { Adapty } from '@/adapty-handler';
import type { AdaptyPaywallProduct, AdaptyProfile } from '@/types';
import {
  createNativeModuleMock,
  emitNativeEvent,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  MAKE_PURCHASE_RESPONSE_SUCCESS,
  EVENT_DID_LOAD_LATEST_PROFILE,
} from './bridge-samples';

describe('Adapty - Purchase Event', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    // Setup native mock
    createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      make_purchase: MAKE_PURCHASE_RESPONSE_SUCCESS,
    });

    // Create Adapty instance
    adapty = new Adapty();
    await adapty.activate('test_key');
  });

  afterEach(() => {
    // No cleanup needed - each test creates new instance
  });

  it('should emit onLatestProfileLoad event with correct format after purchase', async () => {
    // Arrange: Product to purchase
    const product: AdaptyPaywallProduct = {
      vendorProductId: 'com.example.test',
      adaptyId: 'adapty_test',
      paywallProductIndex: 0,
      localizedDescription: 'Test Product',
      localizedTitle: 'Test',
      variationId: 'variation_test',
      paywallABTestName: 'test_ab',
      paywallName: 'Test Paywall',
      accessLevelId: 'test_premium',
      productType: 'subscription',
      price: {
        amount: 9.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$9.99',
      },
    };

    // Arrange: Event listener
    const profileUpdates: AdaptyProfile[] = [];
    adapty.addEventListener('onLatestProfileLoad', profile => {
      profileUpdates.push(profile);
    });

    // Act: Make purchase
    const result = await adapty.makePurchase(product);

    // Manually emit native event (simulating what native SDK does)
    emitNativeEvent('did_load_latest_profile', EVENT_DID_LOAD_LATEST_PROFILE);

    // Wait for event propagation
    await new Promise(resolve => setTimeout(resolve, 50));

    // Assert: Purchase succeeded
    expect(result.type).toBe('success');

    // Assert: Event was emitted with correct format
    expect(profileUpdates).toHaveLength(1);
    const profile = profileUpdates[0]!;

    // Verify profile structure (camelCase conversion)
    expect(profile.profileId).toBe('event_profile_789');

    // Verify access level (camelCase conversion from snake_case bridge data)
    expect(profile.accessLevels?.['test_premium']).toBeDefined();
    const accessLevel = profile.accessLevels!['test_premium']!;
    expect(accessLevel.id).toBe('test_premium');
    expect(accessLevel.isActive).toBe(true);
    expect(accessLevel.vendorProductId).toBe('com.example.test');
    expect(accessLevel.store).toBe('app_store');
    expect(accessLevel.isLifetime).toBe(false);
    expect(accessLevel.willRenew).toBe(true);
    expect(accessLevel.isInGracePeriod).toBe(false);
    expect(accessLevel.isRefund).toBe(false);

    // Verify no circular references
    expect(() => JSON.stringify(profile)).not.toThrow();
  });
});
