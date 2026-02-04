# Integration Tests Coverage Plan - Missing Methods

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add integration tests for uncovered Adapty SDK methods using NativeModuleMock spy approach established in Phase 1 and Phase 2.

**Architecture:** Create isolated test files for each group of related methods. Use typed bridge samples from api.d.ts, verify request encoding (camelCase → snake_case) and response parsing (snake_case → camelCase) through native mock spies.

**Tech Stack:** Jest, TypeScript, React Native NativeModules mocking, api.d.ts types

---

## Coverage Analysis

### ✅ Currently Covered Methods

**Files and methods tested:**
- `activation.test.ts` (14 tests)
  - `activate()` ✅
  - `isActivated()` ✅
  - `enableMock()` ✅ (old MockStore tests, but covered)

- `profile.test.ts` (2 tests)
  - `getProfile()` ✅
  - `updateProfile()` ✅

- `products.test.ts` (2 tests)
  - `getPaywallProducts()` ✅

- `paywall.test.ts` (6 tests)
  - `getPaywall()` ✅
  - `logShowPaywall()` ✅

- `purchase.test.ts` (2 tests)
  - `makePurchase()` ✅

- `purchase-event.test.ts` (1 test)
  - `addEventListener('onLatestProfileLoad')` ✅

**Total:** 8 methods covered

### ❌ Uncovered Methods (19 methods)

**Category 1: Placement methods (Onboarding)**
1. `getOnboarding()` - Fetch onboarding by placement
2. `getOnboardingForDefaultAudience()` - Fetch onboarding for all users

**Category 2: User management**
3. `identify()` - Login user with customerUserId
4. `logout()` - Logout current user

**Category 3: Purchase restoration**
5. `restorePurchases()` - Restore purchases and update profile

**Category 4: Web paywall**
6. `openWebPaywall()` - Open paywall in browser
7. `createWebPaywallUrl()` - Generate paywall URL

**Category 5: Platform-specific**
8. `presentCodeRedemptionSheet()` - iOS only, redeem offer codes
9. `updateCollectingRefundDataConsent()` - iOS only, refund data consent
10. `updateRefundPreference()` - iOS only, refund preference

**Category 6: Configuration**
11. `setLogLevel()` - Set log level
12. `setFallback()` - Set fallback paywalls
13. `setIntegrationIdentifier()` - Set integration identifiers

**Category 7: Analytics/Attribution**
14. `reportTransaction()` - Report transaction in observer mode
15. `updateAttribution()` - Update attribution data

**Category 8: Events**
16. `addEventListener('onInstallationDetailsSuccess')` - Installation success event
17. `addEventListener('onInstallationDetailsFail')` - Installation fail event
18. `removeAllListeners()` - Remove all event listeners

**Category 9: Installation**
19. `getCurrentInstallationStatus()` - Get installation details

---

## Implementation Plan - Isolated Parts

Each part is an independent test file that can be implemented separately.

---

## Part 1: Onboarding Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/onboarding.test.ts`
- Modify: `src/__tests__/integration/adapty-handler/bridge-samples.ts`
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Methods to cover:**
- `getOnboarding(placementId, locale?, params?)`
- `getOnboardingForDefaultAudience(placementId, locale?, params?)`

**Step 1: Add bridge samples**

Add to bridge-samples.ts:

```typescript
// ============================================================================
// GetOnboarding Request/Response Samples
// ============================================================================

export const GET_ONBOARDING_REQUEST: components['requests']['GetOnboarding.Request'] = {
  method: 'get_onboarding',
  placement_id: 'test_onboarding_placement',
  load_timeout: 5,
  fetch_policy: {
    type: 'reload_revalidating_cache_data',
  },
};

export const GET_ONBOARDING_RESPONSE: components['requests']['GetOnboarding.Response'] = {
  success: {
    placement: {
      developer_id: 'test_onboarding_placement',
      ab_test_name: 'onboarding_test',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    onboarding_id: 'onboarding_123',
    onboarding_name: 'test_onboarding_placement',
    variation_id: 'onboarding_variation_456',
    response_created_at: -1,
    request_locale: 'en',
    onboarding_builder: {
      config_url: 'https://example.com/onboarding-config',
    },
  },
};

export const GET_ONBOARDING_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['GetOnboardingForDefaultAudience.Request'] = {
  method: 'get_onboarding_for_default_audience',
  placement_id: 'test_onboarding_placement',
  fetch_policy: {
    type: 'reload_revalidating_cache_data',
  },
};
```

**Step 2: Extend ResponseRegistry**

```typescript
interface ResponseRegistry {
  // ... existing
  get_onboarding?: components['requests']['GetOnboarding.Response'];
  get_onboarding_for_default_audience?: components['requests']['GetOnboardingForDefaultAudience.Response'];
}
```

**Step 3: Create onboarding.test.ts**

```typescript
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import { FetchPolicy } from '@/types/inputs';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_ONBOARDING_REQUEST,
  GET_ONBOARDING_RESPONSE,
  GET_ONBOARDING_FOR_DEFAULT_AUDIENCE_REQUEST,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Onboarding (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_onboarding: GET_ONBOARDING_RESPONSE,
      get_onboarding_for_default_audience: GET_ONBOARDING_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('getOnboarding', () => {
    it('should send correct GetOnboarding.Request', async () => {
      const onboarding = await adapty.getOnboarding('test_onboarding_placement');

      const request = extractNativeRequest<
        components['requests']['GetOnboarding.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('get_onboarding');
      expect(request.placement_id).toBe('test_onboarding_placement');
      expect(request.load_timeout).toBe(5);
      expect(request.fetch_policy.type).toBe('reload_revalidating_cache_data');

      // Verify response parsing
      expect(onboarding.id).toBeDefined();
      expect(onboarding.name).toBe('test_onboarding_placement');
      expect(onboarding.variationId).toBe('onboarding_variation_456');
    });

    it('should include locale in request when provided', async () => {
      await adapty.getOnboarding('test_placement', 'ru');

      const request = extractNativeRequest<
        components['requests']['GetOnboarding.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.locale).toBe('ru');
    });
  });

  describe('getOnboardingForDefaultAudience', () => {
    it('should send correct GetOnboardingForDefaultAudience.Request', async () => {
      const onboarding = await adapty.getOnboardingForDefaultAudience('test_onboarding_placement');

      const request = extractNativeRequest<
        components['requests']['GetOnboardingForDefaultAudience.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('get_onboarding_for_default_audience');
      expect(request.placement_id).toBe('test_onboarding_placement');
      expect(request.fetch_policy.type).toBe('reload_revalidating_cache_data');
    });
  });
});
```

**Step 4: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/onboarding.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/__tests__/integration/adapty-handler/bridge-samples.ts \
        src/__tests__/integration/adapty-handler/native-module-mock.utils.ts \
        src/__tests__/integration/adapty-handler/onboarding.test.ts
git commit -m "test: add integration tests for onboarding methods

Add GetOnboarding and GetOnboardingForDefaultAudience bridge samples.
Create onboarding.test.ts with tests for:
- getOnboarding() request format and response parsing
- getOnboardingForDefaultAudience() request format
- Locale parameter handling

All tests passing ✅"
```

---

## Part 2: User Management Tests (identify, logout)

**Files:**
- Create: `src/__tests__/integration/adapty-handler/user-management.test.ts`
- Modify: `src/__tests__/integration/adapty-handler/bridge-samples.ts`
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Methods to cover:**
- `identify(customerUserId, params?)`
- `logout()`

**Step 1: Add bridge samples**

```typescript
// ============================================================================
// Identify Request/Response Samples
// ============================================================================

export const IDENTIFY_REQUEST: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
};

export const IDENTIFY_REQUEST_WITH_APP_ACCOUNT_TOKEN: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
  parameters: {
    app_account_token: 'ios_token_abc',
  },
};

export const IDENTIFY_RESPONSE_SUCCESS: components['requests']['Identify.Response'] = {
  success: true,
};

// ============================================================================
// Logout Request/Response Samples
// ============================================================================

export const LOGOUT_REQUEST: components['requests']['Logout.Request'] = {
  method: 'logout',
};

export const LOGOUT_RESPONSE_SUCCESS: components['requests']['Logout.Response'] = {
  success: true,
};
```

**Step 2: Extend ResponseRegistry**

```typescript
interface ResponseRegistry {
  // ... existing
  identify?: components['requests']['Identify.Response'];
  logout?: components['requests']['Logout.Response'];
}
```

**Step 3: Create user-management.test.ts**

```typescript
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  IDENTIFY_REQUEST,
  IDENTIFY_RESPONSE_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_RESPONSE_SUCCESS,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - User Management (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      identify: IDENTIFY_RESPONSE_SUCCESS,
      logout: LOGOUT_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('identify', () => {
    it('should send Identify.Request with customer_user_id', async () => {
      await adapty.identify('user_12345');

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'identify',
        expectedRequest: IDENTIFY_REQUEST
      });
    });

    it('should include iOS parameters when provided', async () => {
      await adapty.identify('user_12345', {
        ios: {
          appAccountToken: 'ios_token_abc',
        },
      });

      const request = extractNativeRequest<
        components['requests']['Identify.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.customer_user_id).toBe('user_12345');
      expect(request.parameters?.app_account_token).toBe('ios_token_abc');
    });
  });

  describe('logout', () => {
    it('should send Logout.Request', async () => {
      await adapty.logout();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'logout',
        expectedRequest: LOGOUT_REQUEST
      });
    });
  });
});
```

**Step 4: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/user-management.test.ts`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/__tests__/integration/adapty-handler/bridge-samples.ts \
        src/__tests__/integration/adapty-handler/native-module-mock.utils.ts \
        src/__tests__/integration/adapty-handler/user-management.test.ts
git commit -m "test: add integration tests for user management methods

Add Identify and Logout bridge samples.
Create user-management.test.ts with tests for:
- identify() with and without parameters
- logout() request format

All tests passing ✅"
```

---

## Part 3: Restore Purchases Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/restore-purchases.test.ts`
- Modify: `src/__tests__/integration/adapty-handler/bridge-samples.ts`
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Methods to cover:**
- `restorePurchases()`

**Step 1: Add bridge samples**

```typescript
// ============================================================================
// RestorePurchases Request/Response Samples
// ============================================================================

export const RESTORE_PURCHASES_REQUEST: components['requests']['RestorePurchases.Request'] = {
  method: 'restore_purchases',
};

export const RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM: components['requests']['RestorePurchases.Response'] = {
  success: {
    profile_id: 'restored_profile_123',
    segment_hash: 'restored_hash',
    is_test_user: false,
    timestamp: -1,
    custom_attributes: {},
    paid_access_levels: {
      premium: {
        id: 'premium',
        is_active: true,
        vendor_product_id: 'com.example.premium',
        store: 'app_store',
        activated_at: '2026-01-01T00:00:00Z',
        is_lifetime: false,
        will_renew: true,
        is_in_grace_period: false,
        is_refund: false,
      },
    },
    subscriptions: {},
    non_subscriptions: {},
  },
};
```

**Step 2: Extend ResponseRegistry**

```typescript
restore_purchases?: components['requests']['RestorePurchases.Response'];
```

**Step 3: Create restore-purchases.test.ts**

```typescript
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  RESTORE_PURCHASES_REQUEST,
  RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Restore Purchases (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      restore_purchases: RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('should send RestorePurchases.Request and return profile', async () => {
    const profile = await adapty.restorePurchases();

    expectNativeCall({
      nativeModule: nativeMock,
      method: 'restore_purchases',
      expectedRequest: RESTORE_PURCHASES_REQUEST
    });

    // Verify response parsed to AdaptyProfile
    expect(profile.profileId).toBe('restored_profile_123');
    expect(profile.accessLevels?.['premium']).toBeDefined();
    expect(profile.accessLevels?.['premium']?.isActive).toBe(true);
  });
});
```

**Step 4: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/restore-purchases.test.ts`
Expected: PASS (1 test)

**Step 5: Commit**

```bash
git add src/__tests__/integration/adapty-handler/bridge-samples.ts \
        src/__tests__/integration/adapty-handler/native-module-mock.utils.ts \
        src/__tests__/integration/adapty-handler/restore-purchases.test.ts
git commit -m "test: add integration tests for restorePurchases

Add RestorePurchases bridge samples.
Create restore-purchases.test.ts with test for:
- restorePurchases() request format
- Profile response parsing with access levels

All tests passing ✅"
```

---

## Part 4: Web Paywall Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/web-paywall.test.ts`
- Modify: `src/__tests__/integration/adapty-handler/bridge-samples.ts`
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Methods to cover:**
- `openWebPaywall(paywallOrProduct, openIn?)`
- `createWebPaywallUrl(paywallOrProduct)`

**Step 1: Add bridge samples**

```typescript
// ============================================================================
// OpenWebPaywall Request/Response Samples
// ============================================================================

export const OPEN_WEB_PAYWALL_REQUEST_WITH_PAYWALL: components['requests']['OpenWebPaywall.Request'] = {
  method: 'open_web_paywall',
  open_in: 'browser_out_app',
  paywall: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'paywall_test',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [],
    response_created_at: -1,
    request_locale: 'en',
  },
};

export const OPEN_WEB_PAYWALL_RESPONSE_SUCCESS: components['requests']['OpenWebPaywall.Response'] = {
  success: true,
};

// ============================================================================
// CreateWebPaywallUrl Request/Response Samples
// ============================================================================

export const CREATE_WEB_PAYWALL_URL_REQUEST: components['requests']['CreateWebPaywallUrl.Request'] = {
  method: 'create_web_paywall_url',
  paywall: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'paywall_test',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [],
    response_created_at: -1,
    request_locale: 'en',
  },
};

export const CREATE_WEB_PAYWALL_URL_RESPONSE: components['requests']['CreateWebPaywallUrl.Response'] = {
  success: 'https://example.adapty.io/web-paywall-url',
};
```

**Step 2: Extend ResponseRegistry**

```typescript
open_web_paywall?: components['requests']['OpenWebPaywall.Response'];
create_web_paywall_url?: components['requests']['CreateWebPaywallUrl.Response'];
```

**Step 3: Create web-paywall.test.ts**

```typescript
describe('Adapty - Web Paywall (Bridge Integration)', () => {
  // ... setup similar to other tests

  describe('openWebPaywall', () => {
    it('should send OpenWebPaywall.Request with paywall', async () => {
      const paywall = createMockPaywall(); // helper from helpers.utils.ts

      await adapty.openWebPaywall(paywall, 'browser_out_app');

      const request = extractNativeRequest<
        components['requests']['OpenWebPaywall.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('open_web_paywall');
      expect(request.open_in).toBe('browser_out_app');
      expect(request.paywall).toBeDefined();
    });
  });

  describe('createWebPaywallUrl', () => {
    it('should send CreateWebPaywallUrl.Request and return URL', async () => {
      const paywall = createMockPaywall();

      const url = await adapty.createWebPaywallUrl(paywall);

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'create_web_paywall_url',
        expectedRequest: CREATE_WEB_PAYWALL_URL_REQUEST
      });

      expect(url).toBe('https://example.adapty.io/web-paywall-url');
    });
  });
});
```

**Step 4: Run and commit** (similar pattern)

---

## Part 5: Configuration Tests (setLogLevel, setFallback, setIntegrationIdentifier)

**Files:**
- Create: `src/__tests__/integration/adapty-handler/configuration.test.ts`

**Methods:** setLogLevel, setFallback, setIntegrationIdentifier

**Pattern:** Similar to previous parts - add samples, extend registry, create tests

---

## Part 6: Platform-Specific Tests (iOS only)

**Files:**
- Create: `src/__tests__/integration/adapty-handler/ios-specific.test.ts`

**Methods:**
- `presentCodeRedemptionSheet()`
- `updateCollectingRefundDataConsent()`
- `updateRefundPreference()`

**Note:** These methods return early on Android. Tests should verify this behavior.

---

## Part 7: Attribution Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/attribution.test.ts`

**Methods:**
- `reportTransaction()`
- `updateAttribution()`

---

## Part 8: Installation Status Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/installation.test.ts`

**Methods:**
- `getCurrentInstallationStatus()`

---

## Part 9: Event Listener Tests

**Files:**
- Create: `src/__tests__/integration/adapty-handler/event-listeners.test.ts`

**Methods:**
- `addEventListener('onInstallationDetailsSuccess')`
- `addEventListener('onInstallationDetailsFail')`
- `removeAllListeners()`

**Note:** Requires event emission support (already available from Phase 2)

---

## Implementation Order Recommendation

**Priority 1 (Core functionality):**
1. Part 1: Onboarding (similar to paywall, straightforward)
2. Part 2: User Management (simple methods)
3. Part 3: Restore Purchases (important feature)

**Priority 2 (Additional features):**
4. Part 4: Web Paywall
5. Part 5: Configuration
6. Part 8: Installation Status

**Priority 3 (Platform-specific):**
7. Part 6: iOS-specific methods
8. Part 7: Attribution

**Priority 4 (Events):**
9. Part 9: Event Listeners

## Success Criteria

Full coverage achieved when:

1. ✅ All 19 uncovered methods have tests
2. ✅ All bridge samples added to bridge-samples.ts
3. ✅ ResponseRegistry includes all methods
4. ✅ All tests passing
5. ✅ TypeScript compilation successful
6. ✅ Each part is independent and can be implemented separately
7. ✅ Documentation updated if needed

## Notes

- Each part is **fully isolated** - can be implemented in any order
- Use existing patterns from Phase 1 and Phase 2
- Follow same structure: samples → registry → tests → verify → commit
- Estimated time per part: 30-60 minutes
- Total estimated time: 4-8 hours for all 9 parts
