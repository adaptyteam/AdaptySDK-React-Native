# Integration Tests - Current State and Next Steps

**Date:** 2026-02-04
**Status:** Analysis Complete

## Current State After Restructuring

### ✅ What's Done

**1. Shared utilities structure created:**
```
src/__tests__/integration/
├── shared/
│   ├── native-module-mock.utils.ts       ← Moved from adapty-handler
│   └── bridge-samples/                    ← Moved and modularized
│       ├── index.ts                       ← Barrel export
│       ├── activation.ts
│       ├── profile.ts
│       ├── paywall.ts
│       ├── purchase.ts
│       ├── user-management.ts
│       ├── onboarding.ts
│       ├── configuration.ts
│       ├── installation.ts
│       ├── ios-specific.ts
│       ├── events.ts
│       └── common.ts
```

**2. Imports updated in adapty-handler tests:**
- activation.test.ts ✅
- attribution.test.ts ✅
- paywall.test.ts ✅
- web-paywall.test.ts ✅
- installation.test.ts ✅
- configuration.test.ts ✅
- onboarding.test.ts ✅
- user-management.test.ts ✅
- event-listeners.test.ts ✅
- ios-specific.test.ts ✅
- platform-parameters.test.ts ✅
- profile.test.ts ✅
- products.test.ts ✅
- purchase.test.ts ✅
- purchase-event.test.ts ✅
- restore-purchases.test.ts ✅

**All imports updated to:**
```typescript
import { createNativeModuleMock, ... } from '../shared/native-module-mock.utils';
import { ACTIVATE_REQUEST, ... } from '../shared/bridge-samples';
```

**3. Test status:**
- ✅ All 85 tests passing (22 test suites)
- ✅ TypeScript compiles (minor warnings only)

### 🟡 Minor Issues to Clean Up

**1. TypeScript warnings (non-critical):**
- Unused import `components` in some files
- `possibly undefined` warnings (safe to ignore)

### ❌ What's Missing

**1. UI methods bridge samples:**
- No samples yet for adapty_ui_create_paywall_view
- No samples yet for adapty_ui_present_paywall_view
- No samples yet for adapty_ui_dismiss_paywall_view
- No samples yet for adapty_ui_show_dialog
- No samples yet for adapty_ui_create_onboarding_view
- No samples yet for adapty_ui_present_onboarding_view
- No samples yet for adapty_ui_dismiss_onboarding_view

**2. UI methods integration tests:**
- No view-controller-methods.test.ts yet
- No onboarding-view-controller-methods.test.ts yet

**3. ResponseRegistry not extended for UI methods:**
- Missing UI method types in ResponseRegistry

---

## Next Steps Plan

### Task 1: Add UI methods bridge samples

**Files:**
- Create: `src/__tests__/integration/shared/bridge-samples/ui-methods.ts`
- Modify: `src/__tests__/integration/shared/bridge-samples/index.ts`

**Step 1: Create ui-methods.ts**

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
 * AdaptyUICreatePaywallView.Request
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
 * AdaptyUIPresentPaywallView.Request with default full_screen style
 */
export const ADAPTY_UI_PRESENT_PAYWALL_VIEW_REQUEST: components['requests']['AdaptyUIPresentPaywallView.Request'] = {
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
export const ADAPTY_UI_DISMISS_PAYWALL_VIEW_REQUEST: components['requests']['AdaptyUIDismissPaywallView.Response'] = {
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
 * AdaptyUIShowDialog.Response - primary action selected
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY: components['requests']['AdaptyUIShowDialog.Response'] = {
  success: 'primary',
};

/**
 * AdaptyUIShowDialog.Response - secondary action selected
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

```typescript
export * from './ui-methods';
```

**Step 3: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/__tests__/integration/shared/bridge-samples/ui-methods.ts \
        src/__tests__/integration/shared/bridge-samples/index.ts
git commit -m "test: add UI methods bridge samples to shared

Add typed samples for Adapty UI methods in shared/bridge-samples/ui-methods.ts:

Paywall UI:
- AdaptyUICreatePaywallView (request with params, response)
- AdaptyUIPresentPaywallView (full_screen and page_sheet styles)
- AdaptyUIDismissPaywallView
- AdaptyUIShowDialog (with primary/secondary responses)

Onboarding UI:
- AdaptyUICreateOnboardingView
- AdaptyUIPresentOnboardingView
- AdaptyUIDismissOnboardingView

These enable UI methods bridge integration tests."
```

---

### Task 2: Extend ResponseRegistry for UI methods

**Files:**
- Modify: `src/__tests__/integration/shared/native-module-mock.utils.ts`

**Step 1: Find ResponseRegistry interface and extend**

Add UI method types:

```typescript
interface ResponseRegistry {
  // ... existing SDK methods

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

**Step 2: Verify compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/__tests__/integration/shared/native-module-mock.utils.ts
git commit -m "test: extend ResponseRegistry for UI methods

Add UI method types to ResponseRegistry:
- Paywall UI (create, present, dismiss, showDialog)
- Onboarding UI (create, present, dismiss)

Enables UI methods testing with NativeModuleMock."
```

---

### Task 3: Create paywall UI methods integration test

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
  expectNativeCall,
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
 * - Parameter handling
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
    it('should send AdaptyUICreatePaywallView.Request', async () => {
      const view = await createPaywallView(paywall);

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_paywall_view');
      expect(request.paywall).toBeDefined();
      expect(request.paywall.paywall_id).toBe('paywall_test_placement');
      expect(request.prefetch_products).toBe(true);
      expect(request.load_timeout).toBe(5);

      // Verify response
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
      expect(request.load_timeout).toBe(3); // ms → seconds
    });
  });

  describe('present', () => {
    it('should send request with default full_screen style', async () => {
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
    it('should encode dialog configuration', async () => {
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
      expect(request.configuration.title).toBe('Confirm Action');
      expect(request.configuration.primary_action.title).toBe('Yes');
      expect(request.configuration.secondary_action?.title).toBe('No');

      expect(result).toBe('primary');
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

Add view-controller-methods.test.ts with 6 tests:
- createPaywallView() with parameters
- present() with iOS styles (full_screen, page_sheet)
- dismiss() request format
- showDialog() configuration encoding

Uses NativeModuleMock from shared/ for bridge communication testing.
Separate from event handling tests in paywall/events/.

All 6 tests passing ✅"
```

---

### Task 4: Create onboarding UI methods integration test

**Files:**
- Create: `src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts`

**Pattern:** Similar to Task 3, but for OnboardingViewController

**Step 1: Create test file** (4 tests)

**Step 2: Run tests**

Run: `yarn test src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts`
Expected: PASS (4 tests)

**Step 3: Commit**

---

### Task 5: Fix TypeScript warnings

**Files:**
- Various test files with warnings

**Step 1: Fix unused imports**

Remove unused `components` imports from:
- event-listeners.test.ts
- ios-specific.test.ts
- restore-purchases.test.ts
- web-paywall.test.ts

**Step 2: Fix possibly undefined warnings**

Add null checks or non-null assertions where needed:
- onboarding.test.ts: `request.fetch_policy!.type`

**Step 3: Verify compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS with 0 errors

**Step 4: Commit**

```bash
git add <modified files>
git commit -m "fix: resolve TypeScript warnings in integration tests

- Remove unused components imports
- Add non-null assertions for optional fields
- Fix possibly undefined warnings

All tests still passing, TypeScript compiles cleanly."
```

---

### Task 6: Update documentation

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/README.md`
- Modify: `src/__tests__/integration/ui/README.md`
- Create: `src/__tests__/integration/shared/README.md`

**Step 1: Create shared/README.md**

```markdown
# Shared Test Utilities

Common utilities and bridge samples used across all integration tests.

## Structure

```
shared/
├── native-module-mock.utils.ts  # Native module mocking utilities
└── bridge-samples/               # Typed request/response samples
    ├── index.ts                  # Barrel export (import from here)
    ├── activation.ts             # Activation methods
    ├── profile.ts                # Profile methods
    ├── paywall.ts                # Paywall methods
    ├── purchase.ts               # Purchase methods
    ├── user-management.ts        # Identify, logout
    ├── onboarding.ts             # Onboarding methods
    ├── ui-methods.ts             # UI controller methods
    ├── configuration.ts          # Configuration methods
    ├── installation.ts           # Installation status
    ├── ios-specific.ts           # iOS-only methods
    ├── events.ts                 # Event samples
    └── common.ts                 # Common types/helpers
```

## Usage

### Importing Utilities

```typescript
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall
} from '../shared/native-module-mock.utils';
```

### Importing Bridge Samples

```typescript
// From barrel (recommended)
import {
  ACTIVATE_REQUEST_MINIMAL,
  GET_PROFILE_RESPONSE,
  ADAPTY_UI_CREATE_PAYWALL_VIEW_REQUEST
} from '../shared/bridge-samples';

// From specific file (for tree-shaking)
import { ACTIVATE_REQUEST_MINIMAL } from '../shared/bridge-samples/activation';
```

## Adding New Samples

1. Add to appropriate domain file in `bridge-samples/`
2. File is auto-exported via `index.ts`
3. Use typed interfaces from `api.d.ts`

See [native-module-mock.utils.ts](./native-module-mock.utils.ts) for utility functions documentation.
```

**Step 2: Update adapty-handler/README.md**

Add section about shared utilities:

```markdown
## Shared Utilities

This directory uses shared utilities from `../shared/`:
- **native-module-mock.utils.ts** - Native module mocking (shared with UI tests)
- **bridge-samples/** - Typed request/response samples (modularized by domain)

See [shared/README.md](../shared/README.md) for details.
```

**Step 3: Update ui/README.md**

Add similar section about using shared utilities for new UI methods tests.

**Step 4: Commit**

```bash
git add src/__tests__/integration/shared/README.md \
        src/__tests__/integration/adapty-handler/README.md \
        src/__tests__/integration/ui/README.md
git commit -m "docs: document shared utilities structure

Add README for shared/ directory explaining:
- Directory structure and organization
- How to import utilities and samples
- How to add new samples

Update adapty-handler and ui READMEs to reference shared utilities."
```

---

## Summary

### Current Status

**✅ Already done (by you):**
- Created `shared/` directory structure
- Moved `native-module-mock.utils.ts` to shared
- Moved and modularized `bridge-samples/` to shared
- Updated all adapty-handler test imports
- All 85 tests passing

**❌ Remaining work:**
1. Add UI methods samples to `shared/bridge-samples/ui-methods.ts`
2. Extend ResponseRegistry for UI methods
3. Create UI methods integration tests (2 files, 10 tests)
4. Fix minor TypeScript warnings
5. Document shared utilities in READMEs

**Note:** `bridge-samples-event-adapty-handler.ts` is NOT obsolete - it contains real event data from native logs used in event-listeners.test.ts. Keep as-is or optionally move to shared/.

### Estimated Effort

- Task 1: UI methods samples - 15 min
- Task 2: Extend ResponseRegistry - 5 min
- Task 3: Paywall UI methods tests - 30 min
- Task 4: Onboarding UI methods tests - 30 min
- Task 5: Fix warnings - 10 min
- Task 6: Documentation - 20 min

**Total: ~1.5-2 hours**

### New Structure Benefits

✅ Shared utilities accessible from both adapty-handler and ui
✅ Bridge samples organized by domain (modular)
✅ Clear separation: shared vs test-specific
✅ Barrel exports (index.ts) for convenient imports
✅ Ready for UI methods testing with NativeModuleMock

---

## Files Changed by Restructuring

**Moved:**
- `adapty-handler/native-module-mock.utils.ts` → `shared/native-module-mock.utils.ts`
- `adapty-handler/bridge-samples.ts` → `shared/bridge-samples/*.ts` (split into modules)

**Updated:**
- All 16 test files in adapty-handler (imports updated)

**To create:**
- `shared/bridge-samples/ui-methods.ts`
- `ui/view-controller-methods.test.ts`
- `ui/onboarding-view-controller-methods.test.ts`
- `shared/README.md`

**To delete:**
- `adapty-handler/bridge-samples-event-adapty-handler.ts`
