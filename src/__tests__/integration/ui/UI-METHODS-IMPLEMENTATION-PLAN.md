# UI Methods Bridge Integration Tests - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add integration tests for adapty_ui_* methods using NativeModuleMock approach to verify bridge communication (request encoding and response parsing) for ViewController and OnboardingViewController methods.

**Architecture:** Create UI methods bridge samples in shared/bridge-samples/ui-methods.ts, extend ResponseRegistry for UI methods, create two new test files for paywall and onboarding UI methods. Tests verify request format (camelCase → snake_case) and response parsing, separate from existing event handling tests.

**Tech Stack:** Jest, TypeScript, React Native NativeModules mocking, api.d.ts types, shared test utilities

---

## Context

### Current State

**After shared/ restructuring:**
- ✅ `shared/native-module-mock.utils.ts` - Available for all tests
- ✅ `shared/bridge-samples/` - Modularized by domain
- ✅ All 85 adapty-handler tests passing
- ✅ Imports updated to use `../shared/`

**UI tests current state:**
- ✅ Event tests working (4 files, 4248 lines) - use MockRequestHandler
- ❌ No tests for UI methods bridge communication

**What's missing:**
- UI methods bridge samples (adapty_ui_create, present, dismiss, showDialog)
- ResponseRegistry types for UI methods
- Integration tests for ViewController methods
- Integration tests for OnboardingViewController methods

---

## Task 1: Add UI methods bridge samples

**Files:**
- Create: `src/__tests__/integration/shared/bridge-samples/ui-methods.ts`
- Modify: `src/__tests__/integration/shared/bridge-samples/index.ts`

**Step 1: Create ui-methods.ts with paywall UI samples**

```typescript
/**
 * Bridge samples for Adapty UI methods
 *
 * Covers ViewController and OnboardingViewController methods for bridge communication testing.
 * Event samples are separate in events.ts
 */

import type { components } from '@/types/api';

// ============================================================================
// Paywall UI Methods
// ============================================================================

/**
 * AdaptyUICreatePaywallView.Request with default parameters
 */
export const ADAPTY_UI_CREATE_PAYWALL_VIEW_REQUEST: components['requests']['AdaptyUICreatePaywallView.Request'] = {
  method: 'adapty_ui_create_paywall_view',
  paywall: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'paywall_test_placement',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [],
    response_created_at: -1,
    request_locale: 'en',
    paywall_builder: {
      paywall_builder_id: 'builder_123',
      lang: 'en',
    },
  },
  prefetch_products: true,
  load_timeout: 5,
};

/**
 * AdaptyUICreatePaywallView.Response
 */
export const ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE: components['requests']['AdaptyUICreatePaywallView.Response'] = {
  success: {
    id: 'mock_paywall_view_123',
  },
};

/**
 * AdaptyUIPresentPaywallView.Request with full_screen style
 */
export const ADAPTY_UI_PRESENT_PAYWALL_VIEW_REQUEST_FULL_SCREEN: components['requests']['AdaptyUIPresentPaywallView.Request'] = {
  method: 'adapty_ui_present_paywall_view',
  id: 'mock_paywall_view_123',
  ios_presentation_style: 'full_screen',
};

/**
 * AdaptyUIPresentPaywallView.Request with page_sheet style
 */
export const ADAPTY_UI_PRESENT_PAYWALL_VIEW_REQUEST_PAGE_SHEET: components['requests']['AdaptyUIPresentPaywallView.Request'] = {
  method: 'adapty_ui_present_paywall_view',
  id: 'mock_paywall_view_123',
  ios_presentation_style: 'page_sheet',
};

/**
 * AdaptyUIPresentPaywallView.Response
 */
export const ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE: components['requests']['AdaptyUIPresentPaywallView.Response'] = {
  success: true,
};

/**
 * AdaptyUIDismissPaywallView.Request
 */
export const ADAPTY_UI_DISMISS_PAYWALL_VIEW_REQUEST: components['requests']['AdaptyUIDismissPaywallView.Request'] = {
  method: 'adapty_ui_dismiss_paywall_view',
  id: 'mock_paywall_view_123',
  destroy: false,
};

/**
 * AdaptyUIDismissPaywallView.Response
 */
export const ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE: components['requests']['AdaptyUIDismissPaywallView.Response'] = {
  success: true,
};

/**
 * AdaptyUIShowDialog.Request
 */
export const ADAPTY_UI_SHOW_DIALOG_REQUEST: components['requests']['AdaptyUIShowDialog.Request'] = {
  method: 'adapty_ui_show_dialog',
  id: 'mock_paywall_view_123',
  configuration: {
    title: 'Confirm Action',
    content: 'Are you sure?',
    primary_action: {
      title: 'Yes',
    },
    secondary_action: {
      title: 'No',
    },
  },
};

/**
 * AdaptyUIShowDialog.Response - primary action
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY: components['requests']['AdaptyUIShowDialog.Response'] = {
  success: 'primary',
};

/**
 * AdaptyUIShowDialog.Response - secondary action
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE_SECONDARY: components['requests']['AdaptyUIShowDialog.Response'] = {
  success: 'secondary',
};

// ============================================================================
// Onboarding UI Methods
// ============================================================================

/**
 * AdaptyUICreateOnboardingView.Request
 */
export const ADAPTY_UI_CREATE_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUICreateOnboardingView.Request'] = {
  method: 'adapty_ui_create_onboarding_view',
  onboarding: {
    placement: {
      developer_id: 'test_onboarding_placement',
      ab_test_name: 'onboarding_test',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    onboarding_id: 'onboarding_123',
    onboarding_name: 'test_onboarding',
    variation_id: 'onboarding_variation_456',
    response_created_at: -1,
    request_locale: 'en',
    onboarding_builder: {
      config_url: 'https://example.com/onboarding-config',
    },
  },
  external_urls_presentation: 'browser_in_app',
};

/**
 * AdaptyUICreateOnboardingView.Response
 */
export const ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUICreateOnboardingView.Response'] = {
  success: {
    id: 'mock_onboarding_view_789',
  },
};

/**
 * AdaptyUIPresentOnboardingView.Request
 */
export const ADAPTY_UI_PRESENT_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUIPresentOnboardingView.Request'] = {
  method: 'adapty_ui_present_onboarding_view',
  id: 'mock_onboarding_view_789',
  ios_presentation_style: 'page_sheet',
};

/**
 * AdaptyUIPresentOnboardingView.Response
 */
export const ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUIPresentOnboardingView.Response'] = {
  success: true,
};

/**
 * AdaptyUIDismissOnboardingView.Request
 */
export const ADAPTY_UI_DISMISS_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUIDismissOnboardingView.Request'] = {
  method: 'adapty_ui_dismiss_onboarding_view',
  id: 'mock_onboarding_view_789',
  destroy: false,
};

/**
 * AdaptyUIDismissOnboardingView.Response
 */
export const ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUIDismissOnboardingView.Response'] = {
  success: true,
};
```

**Step 2: Add export to index.ts**

Add to `src/__tests__/integration/shared/bridge-samples/index.ts`:

```typescript
export * from './ui-methods';
```

**Step 3: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS (no new errors)

**Step 4: Commit**

```bash
git add src/__tests__/integration/shared/bridge-samples/ui-methods.ts \
        src/__tests__/integration/shared/bridge-samples/index.ts
git commit -m "test: add UI methods bridge samples

Add typed samples for Adapty UI methods in shared/bridge-samples/ui-methods.ts:

Paywall UI:
- AdaptyUICreatePaywallView (request with params, response)
- AdaptyUIPresentPaywallView (full_screen and page_sheet variants)
- AdaptyUIDismissPaywallView
- AdaptyUIShowDialog (primary/secondary responses)

Onboarding UI:
- AdaptyUICreateOnboardingView
- AdaptyUIPresentOnboardingView
- AdaptyUIDismissOnboardingView

Export from barrel index.ts for convenient importing."
```

---

## Task 2: Extend ResponseRegistry for UI methods

**Files:**
- Modify: `src/__tests__/integration/shared/native-module-mock.utils.ts`

**Step 1: Find ResponseRegistry interface (around line 42) and extend**

Add UI method types at the end of the interface:

```typescript
interface ResponseRegistry {
  // ... existing SDK methods (activate, get_profile, make_purchase, etc.)

  // Adapty UI - Paywall methods
  adapty_ui_create_paywall_view?: components['requests']['AdaptyUICreatePaywallView.Response'];
  adapty_ui_present_paywall_view?: components['requests']['AdaptyUIPresentPaywallView.Response'];
  adapty_ui_dismiss_paywall_view?: components['requests']['AdaptyUIDismissPaywallView.Response'];
  adapty_ui_show_dialog?: components['requests']['AdaptyUIShowDialog.Response'];

  // Adapty UI - Onboarding methods
  adapty_ui_create_onboarding_view?: components['requests']['AdaptyUICreateOnboardingView.Response'];
  adapty_ui_present_onboarding_view?: components['requests']['AdaptyUIPresentOnboardingView.Response'];
  adapty_ui_dismiss_onboarding_view?: components['requests']['AdaptyUIDismissOnboardingView.Response'];
}
```

**Step 2: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/__tests__/integration/shared/native-module-mock.utils.ts
git commit -m "test: extend ResponseRegistry for UI methods

Add UI method response types to ResponseRegistry:
- Paywall UI: create, present, dismiss, showDialog
- Onboarding UI: create, present, dismiss

Enables UI methods testing with createNativeModuleMock."
```

---

## Task 3: Create ViewController methods integration tests

**Files:**
- Create: `src/__tests__/integration/ui/view-controller-methods.test.ts`

**Step 1: Create test file**

```typescript
import { resetBridge } from '@/bridge';
import { createPaywallView } from '@/ui/create-paywall-view';
import { ViewController } from '@/ui/view-controller';
import type { components } from '@/types/api';
import type { AdaptyPaywall } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_RESPONSE,
  ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY,
} from '../shared/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../adapty-handler/setup.utils';

/**
 * Integration tests for ViewController methods (Paywall UI)
 *
 * Tests verify bridge communication for UI methods:
 * - Request encoding (camelCase → snake_case)
 * - Response parsing (snake_case → camelCase)
 * - Parameter handling (prefetchProducts, loadTimeoutMs, iOS styles)
 *
 * Note: Event handling tests are separate in paywall/events/
 */
describe('ViewController Methods (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let paywall: AdaptyPaywall;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_paywall: GET_PAYWALL_RESPONSE,
      adapty_ui_create_paywall_view: ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE,
      adapty_ui_present_paywall_view: ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE,
      adapty_ui_dismiss_paywall_view: ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE,
      adapty_ui_show_dialog: ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    paywall = await adapty.getPaywall('test_placement');
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('createPaywallView', () => {
    it('should send AdaptyUICreatePaywallView.Request with default parameters', async () => {
      const view = await createPaywallView(paywall);

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_paywall_view');
      expect(request.paywall).toBeDefined();
      expect(request.paywall.paywall_id).toBe('paywall_test_placement');
      expect(request.paywall.variation_id).toBe('variation_123');
      expect(request.prefetch_products).toBe(true); // default
      expect(request.load_timeout).toBe(5); // 5000ms → 5s

      // Verify response parsing
      expect((view as any).id).toBe('mock_paywall_view_123');
    });

    it('should encode custom parameters', async () => {
      const view = await createPaywallView(paywall, {
        prefetchProducts: false,
        loadTimeoutMs: 3000,
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.prefetch_products).toBe(false);
      expect(request.load_timeout).toBe(3); // 3000ms → 3s
    });
  });

  describe('present', () => {
    it('should send request with default full_screen presentation style', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.present();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_present_paywall_view');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.ios_presentation_style).toBe('full_screen');
    });

    it('should encode page_sheet presentation style', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.present({ iosPresentationStyle: 'page_sheet' });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.ios_presentation_style).toBe('page_sheet');
    });
  });

  describe('dismiss', () => {
    it('should send AdaptyUIDismissPaywallView.Request', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.dismiss();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIDismissPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_dismiss_paywall_view');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.destroy).toBe(false);
    });
  });

  describe('showDialog', () => {
    it('should encode dialog configuration correctly', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      const result = await view.showDialog({
        title: 'Confirm Action',
        content: 'Are you sure?',
        primaryAction: { title: 'Yes' },
        secondaryAction: { title: 'No' },
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIShowDialog.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_show_dialog');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.configuration.title).toBe('Confirm Action');
      expect(request.configuration.content).toBe('Are you sure?');
      expect(request.configuration.primary_action.title).toBe('Yes');
      expect(request.configuration.secondary_action?.title).toBe('No');

      // Verify response parsing
      expect(result).toBe('primary');
    });

    it('should handle dialog with only primary action', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.showDialog({
        title: 'Alert',
        content: 'This is an alert',
        primaryAction: { title: 'OK' },
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIShowDialog.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.configuration.secondary_action).toBeUndefined();
    });
  });
});
```

**Step 2: Run tests**

Run: `yarn test src/__tests__/integration/ui/view-controller-methods.test.ts`
Expected: PASS (6 tests)

**Step 3: Commit**

```bash
git add src/__tests__/integration/ui/view-controller-methods.test.ts
git commit -m "test: add ViewController methods bridge integration tests

Create view-controller-methods.test.ts with 6 tests:
- createPaywallView() with default and custom parameters
- present() with full_screen and page_sheet styles
- dismiss() request format
- showDialog() with full and minimal configurations

Uses NativeModuleMock from shared/ for bridge communication testing.
Separate from event handling tests.

All 6 tests passing ✅"
```

---

## Task 4: Create OnboardingViewController methods integration tests

**Files:**
- Create: `src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts`

**Step 1: Create test file**

```typescript
import { resetBridge } from '@/bridge';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import type { components } from '@/types/api';
import type { AdaptyOnboarding } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_ONBOARDING_RESPONSE,
  ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE,
} from '../shared/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../adapty-handler/setup.utils';

/**
 * Integration tests for OnboardingViewController methods
 *
 * Tests verify bridge communication for onboarding UI methods:
 * - Request encoding (camelCase → snake_case)
 * - Response parsing (snake_case → camelCase)
 * - Parameter handling (externalUrlsPresentation, iOS styles)
 *
 * Note: Event handling tests are separate in onboarding/events/
 */
describe('OnboardingViewController Methods (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let onboarding: AdaptyOnboarding;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_onboarding: GET_ONBOARDING_RESPONSE,
      adapty_ui_create_onboarding_view: ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE,
      adapty_ui_present_onboarding_view: ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE,
      adapty_ui_dismiss_onboarding_view: ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    onboarding = await adapty.getOnboarding('test_onboarding_placement');
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('createOnboardingView', () => {
    it('should send AdaptyUICreateOnboardingView.Request with default parameters', async () => {
      const view = await createOnboardingView(onboarding);

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreateOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_onboarding_view');
      expect(request.onboarding).toBeDefined();
      expect(request.onboarding.onboarding_id).toBe('onboarding_123');
      expect(request.onboarding.variation_id).toBe('onboarding_variation_456');
      expect(request.external_urls_presentation).toBe('browser_in_app'); // default

      // Verify response parsing
      expect((view as any).id).toBe('mock_onboarding_view_789');
    });

    it('should encode custom externalUrlsPresentation', async () => {
      const view = await createOnboardingView(onboarding, {
        externalUrlsPresentation: 'browser_out_app',
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreateOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.external_urls_presentation).toBe('browser_out_app');
    });
  });

  describe('present', () => {
    it('should send AdaptyUIPresentOnboardingView.Request', async () => {
      const view = await createOnboardingView(onboarding);
      nativeMock.handler.mockClear();

      await view.present({ iosPresentationStyle: 'page_sheet' });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_present_onboarding_view');
      expect(request.id).toBe('mock_onboarding_view_789');
      expect(request.ios_presentation_style).toBe('page_sheet');
    });
  });

  describe('dismiss', () => {
    it('should send AdaptyUIDismissOnboardingView.Request', async () => {
      const view = await createOnboardingView(onboarding);
      nativeMock.handler.mockClear();

      await view.dismiss();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIDismissOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_dismiss_onboarding_view');
      expect(request.id).toBe('mock_onboarding_view_789');
      expect(request.destroy).toBe(false);
    });
  });
});
```

**Step 2: Run tests**

Run: `yarn test src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts`
Expected: PASS (4 tests)

**Step 3: Commit**

```bash
git add src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts
git commit -m "test: add OnboardingViewController methods bridge integration tests

Create onboarding-view-controller-methods.test.ts with 4 tests:
- createOnboardingView() with default and custom parameters
- present() with iOS presentation style
- dismiss() request format

Uses NativeModuleMock from shared/ for bridge communication testing.
Separate from event handling tests.

All 4 tests passing ✅"
```

---

## Task 5: Run full test suite and verify

**Files:**
- None (verification)

**Step 1: Run all integration tests**

Run: `yarn test src/__tests__/integration`
Expected: All tests PASS

Check new test counts:
- adapty-handler: 85 tests (unchanged)
- ui: 10 new tests (6 paywall + 4 onboarding)
- **Total: 95+ tests**

**Step 2: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS (or only pre-existing warnings)

**Step 3: Review commit history**

```bash
git log --oneline -10
```

Expected: 4 commits (samples, registry, paywall tests, onboarding tests)

---

## Task 6: Update documentation

**Files:**
- Modify: `src/__tests__/integration/ui/README.md`
- Create: `src/__tests__/integration/shared/README.md`

**Step 1: Create shared/README.md**

```markdown
# Shared Test Utilities

Common utilities and bridge samples used across all integration tests.

## Directory Structure

```
shared/
├── native-module-mock.utils.ts    # Native module mocking utilities
└── bridge-samples/                 # Typed request/response samples
    ├── index.ts                    # Barrel export
    ├── activation.ts               # Activation methods
    ├── profile.ts                  # Profile methods
    ├── paywall.ts                  # Paywall methods
    ├── purchase.ts                 # Purchase methods
    ├── user-management.ts          # identify, logout
    ├── onboarding.ts               # Onboarding methods
    ├── ui-methods.ts               # UI controller methods ← NEW
    ├── configuration.ts            # Configuration methods
    ├── installation.ts             # Installation status
    ├── ios-specific.ts             # iOS-only methods
    ├── events.ts                   # Event samples
    └── common.ts                   # Common types/helpers
```

## Usage

### Importing Utilities

```typescript
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock
} from '../shared/native-module-mock.utils';
```

### Importing Bridge Samples

```typescript
// From barrel (recommended)
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_RESPONSE,
  ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE
} from '../shared/bridge-samples';

// From specific file (for tree-shaking)
import { ACTIVATE_RESPONSE_SUCCESS } from '../shared/bridge-samples/activation';
import { ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE } from '../shared/bridge-samples/ui-methods';
```

## Adding New Samples

1. Add to appropriate domain file in `bridge-samples/`
2. Use strictly typed interfaces from `@/types/api`
3. Export is automatic via `index.ts` barrel

Example:
```typescript
// In bridge-samples/ui-methods.ts
export const MY_UI_REQUEST: components['requests']['MyMethod.Request'] = {
  method: 'my_method',
  // ... fields in snake_case
};
```

## Shared Utilities Documentation

See [native-module-mock.utils.ts](./native-module-mock.utils.ts) JSDoc for:
- `createNativeModuleMock()` - Create mock with response registry
- `extractNativeRequest()` - Extract typed request from spy
- `expectNativeCall()` - Assert on method call and request format
- `resetNativeModuleMock()` - Clean up mock state
- `emitNativeEvent()` - Emit events for testing (Phase 2)
- `getTestEmitter()` - Access test event emitter
```

**Step 2: Update ui/README.md**

Add section after "Overview":

```markdown
## Test Organization

This directory contains two types of integration tests:

### 1. Event Handling Tests (events/ subdirectories)

**Purpose:** Test event emission and parsing
**Approach:** Use MockRequestHandler with testEmitter
**Files:**
- `paywall/events/*-events.test.ts` - Paywall event handlers
- `onboarding/events/onboarding-view-controller-events.test.ts` - Onboarding event handlers

**What they test:**
- Events emitted from native are parsed correctly (snake_case → camelCase)
- Event handlers receive correct data
- Event filtering by viewId
- Default handlers behavior

### 2. UI Methods Tests (root ui/ directory)

**Purpose:** Test bridge communication for UI controller methods
**Approach:** Use NativeModuleMock (same as adapty-handler tests)
**Files:**
- `view-controller-methods.test.ts` - Paywall UI methods ← NEW
- `onboarding-view-controller-methods.test.ts` - Onboarding UI methods ← NEW

**What they test:**
- Request encoding (camelCase → snake_case)
- Response parsing (snake_case → camelCase)
- Parameter handling (prefetchProducts, loadTimeoutMs, iOS styles)

Both types are **complementary**:
- Events tests ensure event handling works
- Methods tests ensure bridge communication is correct

## Shared Utilities

UI tests use shared utilities from `../shared/`:
- `native-module-mock.utils.ts` - Native module mocking (for methods tests)
- `bridge-samples/ui-methods.ts` - UI methods request/response samples

See [../shared/README.md](../shared/README.md) for details.
```

**Step 3: Commit**

```bash
git add src/__tests__/integration/shared/README.md \
        src/__tests__/integration/ui/README.md
git commit -m "docs: document shared utilities and UI test organization

Add shared/README.md:
- Explains directory structure
- How to import utilities and samples
- How to add new samples

Update ui/README.md:
- Clarify two types of tests (events vs methods)
- Explain different approaches (MockRequestHandler vs NativeModuleMock)
- Reference shared utilities

Makes it clear why different testing approaches coexist."
```

---

## Summary

### Implementation Overview

**New files created:**
- `shared/bridge-samples/ui-methods.ts` - 7 UI methods samples
- `ui/view-controller-methods.test.ts` - 6 tests
- `ui/onboarding-view-controller-methods.test.ts` - 4 tests
- `shared/README.md` - Documentation

**Modified files:**
- `shared/bridge-samples/index.ts` - Export ui-methods
- `shared/native-module-mock.utils.ts` - Extended ResponseRegistry
- `ui/README.md` - Updated documentation

**Tests added:** 10 new tests (6 paywall + 4 onboarding)

**Total integration tests after:** 95+ tests (85 adapty-handler + 10 UI methods)

### What This Achieves

**Before:**
- adapty-handler methods: Bridge communication tested ✅
- UI methods: Bridge communication NOT tested ❌
- UI events: Event handling tested ✅

**After:**
- adapty-handler methods: Bridge communication tested ✅
- UI methods: Bridge communication tested ✅
- UI events: Event handling tested ✅

**Complete coverage** of all bridge communication paths!

### Key Principles

1. **Separation of concerns:**
   - Event tests → MockRequestHandler (event emission)
   - Methods tests → NativeModuleMock (bridge communication)

2. **Shared utilities:**
   - All bridge communication tests use `shared/native-module-mock.utils.ts`
   - All samples in `shared/bridge-samples/`

3. **Consistent patterns:**
   - UI methods tests follow same pattern as adapty-handler tests
   - Same setup/teardown, same assertion utilities

### Estimated Effort

- Task 1: UI methods samples - 15 min
- Task 2: Extend ResponseRegistry - 5 min
- Task 3: Paywall UI methods tests - 30 min
- Task 4: Onboarding UI methods tests - 30 min
- Task 5: Verification - 10 min
- Task 6: Documentation - 20 min

**Total: ~1.5-2 hours**
