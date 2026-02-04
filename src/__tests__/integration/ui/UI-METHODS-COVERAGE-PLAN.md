# UI Methods Integration Tests Coverage Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add integration tests for adapty_ui_* methods (ViewController and OnboardingViewController) using NativeModuleMock spy approach to verify request encoding and response parsing.

**Architecture:** Create new test files for UI method bridge communication (separate from existing event tests). Use NativeModuleMock from adapty-handler utilities, add typed bridge samples for UI methods, verify request format and response parsing.

**Tech Stack:** Jest, TypeScript, React Native NativeModules mocking, api.d.ts types

---

## Context

### Current State

**Existing UI tests** (`src/__tests__/integration/ui/**/*-events.test.ts`):
- Focus: Event handling and parsing (onClose, onPurchaseStarted, etc.)
- Approach: MockRequestHandler with testEmitter
- Coverage: 4248 lines, comprehensive event testing
- **Keep as-is** - different test purpose

**Missing: UI methods bridge communication tests**
- ❌ adapty_ui_create_paywall_view - request/response not tested
- ❌ adapty_ui_present_paywall_view - request format not tested
- ❌ adapty_ui_dismiss_paywall_view - request format not tested
- ❌ adapty_ui_show_dialog - request format not tested
- ❌ adapty_ui_create_onboarding_view - request/response not tested
- ❌ adapty_ui_present_onboarding_view - request format not tested
- ❌ adapty_ui_dismiss_onboarding_view - request format not tested

### New Tests Purpose

**What to test:**
- Request encoding: paywall/onboarding → snake_case JSON
- Response parsing: AdaptyUiView structure
- Parameter encoding: prefetchProducts, loadTimeoutMs, etc.
- iOS presentation styles
- Dialog configuration encoding

**What NOT to test:**
- Event handling (already covered in *-events.test.ts)
- Event parsing (already covered)
- ViewController behavior (already covered)

---

## Task 1: Add UI method bridge samples

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/bridge-samples.ts`

**Step 1: Add Paywall UI method samples**

Add at end of bridge-samples.ts:

```typescript
// ============================================================================
// Adapty UI - Paywall View Methods
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
    paywall_id: 'paywall_test',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [],
    response_created_at: -1,
    request_locale: 'en',
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
 * AdaptyUIPresentPaywallView.Request
 */
export const ADAPTY_UI_PRESENT_PAYWALL_VIEW_REQUEST: components['requests']['AdaptyUIPresentPaywallView.Request'] = {
  method: 'adapty_ui_present_paywall_view',
  id: 'mock_paywall_view_123',
  ios_presentation_style: 'full_screen',
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
 * AdaptyUIShowDialog.Response
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE: components['requests']['AdaptyUIShowDialog.Response'] = {
  success: 'primary',
};
```

**Step 2: Add Onboarding UI method samples**

```typescript
// ============================================================================
// Adapty UI - Onboarding View Methods
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

**Step 3: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS

**Step 4: Commit bridge samples**

```bash
git add src/__tests__/integration/adapty-handler/bridge-samples.ts
git commit -m "test: add bridge samples for UI methods

Add typed samples for Adapty UI methods:

Paywall UI:
- AdaptyUICreatePaywallView.Request/Response
- AdaptyUIPresentPaywallView.Request/Response
- AdaptyUIDismissPaywallView.Request/Response
- AdaptyUIShowDialog.Request/Response

Onboarding UI:
- AdaptyUICreateOnboardingView.Request/Response
- AdaptyUIPresentOnboardingView.Request/Response
- AdaptyUIDismissOnboardingView.Request/Response

These will be used in new UI methods integration tests."
```

---

## Task 2: Extend ResponseRegistry for UI methods

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Step 1: Extend ResponseRegistry**

Add to ResponseRegistry interface:

```typescript
interface ResponseRegistry {
  // ... existing methods

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
git add src/__tests__/integration/adapty-handler/native-module-mock.utils.ts
git commit -m "test: extend ResponseRegistry for UI methods

Add UI method types to ResponseRegistry:
- Paywall UI methods (create, present, dismiss, showDialog)
- Onboarding UI methods (create, present, dismiss)

Prepares utilities for UI methods integration tests."
```

---

## Task 3: Create paywall UI methods integration tests

**Files:**
- Create: `src/__tests__/integration/ui/view-controller-methods.test.ts`

**Step 1: Create view-controller-methods.test.ts**

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
} from '../../adapty-handler/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_RESPONSE,
  ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_PAYWALL_VIEW_REQUEST,
  ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_SHOW_DIALOG_REQUEST,
  ADAPTY_UI_SHOW_DIALOG_RESPONSE,
} from '../../adapty-handler/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../../adapty-handler/setup.utils';

/**
 * Integration tests for ViewController methods (Paywall UI)
 *
 * These tests verify bridge communication for UI methods:
 * - createPaywallView() request encoding and response parsing
 * - present() request format with iOS presentation styles
 * - dismiss() request format
 * - showDialog() configuration encoding
 *
 * Note: Event handling tests are separate in paywall-view-controller-events.test.ts
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
      adapty_ui_show_dialog: ADAPTY_UI_SHOW_DIALOG_RESPONSE,
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
    it('should send AdaptyUICreatePaywallView.Request with paywall encoded', async () => {
      const view = await createPaywallView(paywall);

      // Verify request format
      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_paywall_view');
      expect(request.paywall).toBeDefined();
      expect(request.paywall.paywall_id).toBe('paywall_test_placement');
      expect(request.paywall.variation_id).toBe('variation_123');
      expect(request.prefetch_products).toBe(true);
      expect(request.load_timeout).toBe(5);

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
      expect(request.load_timeout).toBe(3); // ms → seconds
    });
  });

  describe('present', () => {
    it('should send AdaptyUIPresentPaywallView.Request with default style', async () => {
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
      expect(request.ios_presentation_style).toBe('full_screen'); // default
    });

    it('should encode iOS presentation style', async () => {
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
    it('should send AdaptyUIShowDialog.Request with configuration', async () => {
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

Create view-controller-methods.test.ts with tests for:
- createPaywallView() request encoding and response parsing
- present() with iOS presentation styles
- dismiss() request format
- showDialog() configuration encoding

Tests verify bridge communication for UI methods (separate from event tests).

6 tests passing ✅"
```

---

## Task 4: Create onboarding UI methods integration tests

**Files:**
- Create: `src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts`

**Step 1: Create onboarding-view-controller-methods.test.ts**

```typescript
import { resetBridge } from '@/bridge';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import type { components } from '@/types/api';
import type { AdaptyOnboarding } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../../adapty-handler/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_ONBOARDING_RESPONSE,
  ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE,
} from '../../adapty-handler/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../../adapty-handler/setup.utils';

/**
 * Integration tests for OnboardingViewController methods
 *
 * These tests verify bridge communication for onboarding UI methods:
 * - createOnboardingView() request encoding and response parsing
 * - present() request format with iOS presentation styles
 * - dismiss() request format
 *
 * Note: Event handling tests are separate in onboarding-view-controller-events.test.ts
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
    it('should send AdaptyUICreateOnboardingView.Request with onboarding encoded', async () => {
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
git add src/__tests__/integration/ui/view-controller-methods.test.ts \
        src/__tests__/integration/ui/onboarding-view-controller-methods.test.ts
git commit -m "test: add UI methods bridge integration tests

Create integration tests for UI controller methods:

view-controller-methods.test.ts (6 tests):
- createPaywallView() with parameters
- present() with iOS styles
- dismiss() request format
- showDialog() configuration encoding

onboarding-view-controller-methods.test.ts (4 tests):
- createOnboardingView() with parameters
- present() with iOS styles
- dismiss() request format

Tests verify bridge communication for UI methods using NativeModuleMock.
Separate from existing event handling tests.

All 10 tests passing ✅"
```

---

## Task 5: Update UI test documentation

**Files:**
- Modify: `src/__tests__/integration/ui/README.md`

**Step 1: Add section about UI methods tests**

Add after "Overview" section:

```markdown
## Test Organization

### Event Handling Tests
Located in subdirectories (paywall/, onboarding/):
- `*-events.test.ts` files test event emission and parsing
- Use MockRequestHandler with testEmitter
- Focus: Event handlers receive correct data format (snake_case → camelCase)

### UI Methods Tests
Located in root ui/ directory:
- `*-methods.test.ts` files test bridge communication for UI methods
- Use NativeModuleMock approach (same as adapty-handler tests)
- Focus: Request encoding (camelCase → snake_case) and response parsing

Both test types are important and complementary:
- Events tests: How events are handled
- Methods tests: How methods communicate with native
```

**Step 2: Commit**

```bash
git add src/__tests__/integration/ui/README.md
git commit -m "docs: document UI test organization

Add section explaining two types of UI tests:
- Event tests (*-events.test.ts) - MockRequestHandler for event emission
- Methods tests (*-methods.test.ts) - NativeModuleMock for bridge communication

Clarifies that both approaches serve different purposes and are complementary."
```

---

## Summary

### What This Plan Adds

**New test files (2):**
- `view-controller-methods.test.ts` - Paywall UI methods (6 tests)
- `onboarding-view-controller-methods.test.ts` - Onboarding UI methods (4 tests)

**Total new tests:** 10 tests

**Bridge samples added:** 7 UI methods (create, present, dismiss for both + showDialog)

**Methods covered:**
- ✅ adapty_ui_create_paywall_view
- ✅ adapty_ui_present_paywall_view
- ✅ adapty_ui_dismiss_paywall_view
- ✅ adapty_ui_show_dialog
- ✅ adapty_ui_create_onboarding_view
- ✅ adapty_ui_present_onboarding_view
- ✅ adapty_ui_dismiss_onboarding_view

### What Stays Unchanged

**Existing event tests (4 files, 4248 lines):**
- Keep using MockRequestHandler
- Focus on event handling
- No changes needed

### Benefits

1. **Comprehensive UI coverage** - methods + events both tested
2. **Consistent with adapty-handler** - UI methods use same NativeModuleMock approach
3. **Clean separation** - methods vs events have different test files
4. **Low risk** - new tests, no changes to existing working tests

### Estimated Effort

- Task 1: 15-20 minutes (bridge samples)
- Task 2: 5 minutes (extend ResponseRegistry)
- Task 3: 30-45 minutes (paywall methods tests)
- Task 4: 30-45 minutes (onboarding methods tests)
- Task 5: 10 minutes (documentation)

**Total: 1.5-2 hours**

---

## Success Criteria

UI methods coverage complete when:

1. ✅ All 7 UI methods have bridge integration tests
2. ✅ Bridge samples added for all UI methods
3. ✅ ResponseRegistry extended
4. ✅ 10 new tests passing
5. ✅ TypeScript compilation successful
6. ✅ Documentation updated
7. ✅ No changes to existing event tests (they continue working)
