# Native Mock Utils Options API Refactoring - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor all utility functions in native-module-mock.utils.ts from positional arguments to options object pattern with named parameters for improved readability and API consistency.

**Architecture:** Replace positional arguments with typed options interfaces, update all ~30-40 call sites in 6 test files, update documentation examples. Single atomic commit with all changes.

**Tech Stack:** TypeScript, Jest, React Native test utilities

---

## Task 1: Update function signatures in native-module-mock.utils.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

**Step 1: Add options interfaces**

Add before function declarations (around line 52, after ResponseRegistry):

```typescript
/**
 * Options for extractNativeRequest function
 */
interface ExtractNativeRequestOptions {
  nativeModule: MockNativeModule;
  callIndex?: number; // default = 0
}

/**
 * Options for expectNativeCall function
 */
interface ExpectNativeCallOptions<T extends { method: string }> {
  nativeModule: MockNativeModule;
  method: string;
  expectedRequest: T;
  callIndex?: number; // default = 0
}

/**
 * Options for emitNativeEvent function
 */
interface EmitNativeEventOptions {
  eventName: string;
  eventData: any;
}
```

**Step 2: Update extractNativeRequest signature and implementation**

Replace function at line 140:

```typescript
/**
 * Extracts and parses the request sent to native module
 *
 * @param options - Extraction options
 * @param options.nativeModule - Mocked native module
 * @param options.callIndex - Which call to inspect (default: 0 = first call)
 * @returns Parsed request object with type safety
 *
 * @example
 * ```typescript
 * const request = extractNativeRequest<
 *   components['requests']['Activate.Request']
 * >({
 *   nativeModule: nativeMock,
 *   callIndex: 1
 * });
 *
 * expect(request.configuration.api_key).toBe('test_key');
 * ```
 */
export function extractNativeRequest<T>(
  options: ExtractNativeRequestOptions
): T {
  const { nativeModule, callIndex = 0 } = options;

  const calls = nativeModule.handler.mock.calls;

  if (calls.length <= callIndex) {
    throw new Error(
      `No call at index ${callIndex}. Total calls: ${calls.length}`,
    );
  }

  const call = calls[callIndex];
  if (!call) {
    throw new Error(`Call at index ${callIndex} is undefined`);
  }

  const [, params] = call;
  const parsedArgs = JSON.parse(params.args) as T;

  return parsedArgs;
}
```

**Step 3: Update expectNativeCall signature and implementation**

Replace function at line 184:

```typescript
/**
 * Verifies that native module was called with correct request format
 *
 * Uses toMatchObject for partial matching - SDK may add extra fields like
 * cross_platform_sdk_name, activate_ui, media_cache, etc.
 *
 * @param options - Verification options
 * @param options.nativeModule - Mocked native module
 * @param options.method - Expected method name (e.g., 'activate')
 * @param options.expectedRequest - Expected request structure
 * @param options.callIndex - Which call to verify (default: 0 = first call)
 *
 * @example
 * ```typescript
 * expectNativeCall({
 *   nativeModule: nativeMock,
 *   method: 'activate',
 *   expectedRequest: ACTIVATE_REQUEST_MINIMAL
 * });
 * ```
 */
export function expectNativeCall<T extends { method: string }>(
  options: ExpectNativeCallOptions<T>
): void {
  const { nativeModule, method: expectedMethod, expectedRequest, callIndex = 0 } = options;

  const calls = nativeModule.handler.mock.calls;

  if (calls.length <= callIndex) {
    throw new Error(
      `No call at index ${callIndex}. Total calls: ${calls.length}`,
    );
  }

  const call = calls[callIndex];
  if (!call) {
    throw new Error(`Call at index ${callIndex} is undefined`);
  }

  const [actualMethod, params] = call;
  const actualRequest = JSON.parse(params.args) as T;

  expect(actualMethod).toBe(expectedMethod);
  expect(actualRequest).toMatchObject(expectedRequest);
}
```

**Step 4: Update emitNativeEvent signature and implementation**

Replace function at line 295:

```typescript
/**
 * Emits a mock native event for testing
 *
 * @param options - Event emission options
 * @param options.eventName - Native event name (e.g., 'did_load_latest_profile')
 * @param options.eventData - Event data as object (will be JSON.stringified)
 *
 * @example
 * ```typescript
 * emitNativeEvent({
 *   eventName: 'did_load_latest_profile',
 *   eventData: EVENT_DID_LOAD_LATEST_PROFILE
 * });
 * ```
 */
export function emitNativeEvent(options: EmitNativeEventOptions): void {
  const { eventName, eventData } = options;
  const emitter = getTestEmitter();
  emitter.emit(eventName, JSON.stringify(eventData));
}
```

**Step 5: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: FAIL with errors in test files (using old API)

---

## Task 2: Update activation.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/activation.test.ts`

**Step 1: Update all extractNativeRequest calls**

Find and replace pattern:

```typescript
// FIND (5 occurrences)
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>(nativeMock, 0);

// REPLACE WITH
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock
});
```

For calls with callIndex > 0, include callIndex explicitly.

**Step 2: Update all expectNativeCall calls**

Find and replace pattern:

```typescript
// FIND (example with callIndex = 0)
expectNativeCall(nativeMock, 'activate', ACTIVATE_REQUEST_MINIMAL, 0);

// REPLACE WITH
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL
});

// FIND (example with callIndex > 0)
expectNativeCall(nativeMock, 'is_activated', IS_ACTIVATED_REQUEST, 0);

// REPLACE WITH
expectNativeCall({
  nativeModule: nativeMock,
  method: 'is_activated',
  expectedRequest: IS_ACTIVATED_REQUEST
});
```

**Step 3: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/activation.test.ts`
Expected: PASS (14 tests)

---

## Task 3: Update profile.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/profile.test.ts`

**Step 1: Update extractNativeRequest call (line 65)**

```typescript
// BEFORE
const updateRequest = extractNativeRequest<
  components['requests']['UpdateProfile.Request']
>(nativeMock, 1);

// AFTER
const updateRequest = extractNativeRequest<
  components['requests']['UpdateProfile.Request']
>({
  nativeModule: nativeMock,
  callIndex: 1
});
```

**Step 2: Update expectNativeCall call (line 85)**

```typescript
// BEFORE
expectNativeCall(
  nativeMock,
  'get_profile',
  { method: 'get_profile' },
  2
);

// AFTER
expectNativeCall({
  nativeModule: nativeMock,
  method: 'get_profile',
  expectedRequest: { method: 'get_profile' },
  callIndex: 2
});
```

**Step 3: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/profile.test.ts`
Expected: PASS (2 tests)

---

## Task 4: Update products.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/products.test.ts`

**Step 1: Update extractNativeRequest call (line 91)**

```typescript
// BEFORE
const request = extractNativeRequest<
  components['requests']['GetPaywallProducts.Request']
>(nativeMock, 1);

// AFTER
const request = extractNativeRequest<
  components['requests']['GetPaywallProducts.Request']
>({
  nativeModule: nativeMock,
  callIndex: 1
});
```

**Step 2: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/products.test.ts`
Expected: PASS (2 tests)

---

## Task 5: Update paywall.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/paywall.test.ts`

**Step 1: Update expectNativeCall call (line 57)**

```typescript
// BEFORE
expectNativeCall(nativeMock, 'get_paywall', GET_PAYWALL_REQUEST, 0);

// AFTER
expectNativeCall({
  nativeModule: nativeMock,
  method: 'get_paywall',
  expectedRequest: GET_PAYWALL_REQUEST
});
```

**Step 2: Update extractNativeRequest calls (lines 107, 156, 181)**

```typescript
// BEFORE (line 107)
const request = extractNativeRequest<
  components['requests']['GetPaywall.Request']
>(nativeMock, 0);

// AFTER
const request = extractNativeRequest<
  components['requests']['GetPaywall.Request']
>({
  nativeModule: nativeMock
});

// Similar for lines 156 and 181
```

**Step 3: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/paywall.test.ts`
Expected: PASS (6 tests)

---

## Task 6: Update purchase.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/purchase.test.ts`

**Step 1: Update expectNativeCall call (line 58)**

```typescript
// BEFORE
expectNativeCall<components['requests']['MakePurchase.Request']>(
  nativeMock,
  'make_purchase',
  MAKE_PURCHASE_REQUEST,
  1
);

// AFTER
expectNativeCall<components['requests']['MakePurchase.Request']>({
  nativeModule: nativeMock,
  method: 'make_purchase',
  expectedRequest: MAKE_PURCHASE_REQUEST,
  callIndex: 1
});
```

**Step 2: Update extractNativeRequest call (line 67)**

```typescript
// BEFORE
const request = extractNativeRequest<
  components['requests']['MakePurchase.Request']
>(nativeMock, 1);

// AFTER
const request = extractNativeRequest<
  components['requests']['MakePurchase.Request']
>({
  nativeModule: nativeMock,
  callIndex: 1
});
```

**Step 3: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/purchase.test.ts`
Expected: PASS (2 tests)

---

## Task 7: Update purchase-event.test.ts

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/purchase-event.test.ts`

**Step 1: Update emitNativeEvent call (line 74)**

```typescript
// BEFORE
emitNativeEvent('did_load_latest_profile', EVENT_DID_LOAD_LATEST_PROFILE);

// AFTER
emitNativeEvent({
  eventName: 'did_load_latest_profile',
  eventData: EVENT_DID_LOAD_LATEST_PROFILE
});
```

**Step 2: Run tests**

Run: `yarn test src/__tests__/integration/adapty-handler/purchase-event.test.ts`
Expected: PASS (1 test)

---

## Task 8: Update README.md examples

**Files:**
- Modify: `src/__tests__/integration/adapty-handler/README.md`

**Step 1: Update extractNativeRequest example**

Find section "### Testing Request Format" (around line 142) and update:

```typescript
// Before
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>(nativeMock, 0);

// After
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock
});
```

**Step 2: Update expectNativeCall example**

Find section "#### `expectNativeCall(mock, method, expectedRequest, callIndex)`" (around line 119) and update:

```markdown
#### `expectNativeCall(options)`

Verifies that native module was called with correct parameters:

```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL
});
```
```

**Step 3: Update emitNativeEvent example (if present)**

Search for emitNativeEvent examples and update to options API.

**Step 4: Update "Writing Tests" section examples**

Find all code examples in README and update to use options API.

---

## Task 9: Verify all tests pass

**Files:**
- None (verification)

**Step 1: Run full test suite**

Run: `yarn test src/__tests__/integration/adapty-handler`
Expected: All 48 tests PASS

**Step 2: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: SUCCESS (no errors)

**Step 3: Count updated call sites**

```bash
# Count extractNativeRequest calls
grep -r "extractNativeRequest({" src/__tests__/integration/adapty-handler/*.test.ts | wc -l

# Count expectNativeCall calls
grep -r "expectNativeCall({" src/__tests__/integration/adapty-handler/*.test.ts | wc -l

# Count emitNativeEvent calls
grep -r "emitNativeEvent({" src/__tests__/integration/adapty-handler/*.test.ts | wc -l
```

Expected: ~15 extractNativeRequest, ~10 expectNativeCall, ~1 emitNativeEvent

---

## Task 10: Create atomic commit

**Files:**
- All modified files

**Step 1: Review all changes**

```bash
git status
git diff
```

**Step 2: Create single atomic commit**

```bash
git add src/__tests__/integration/adapty-handler/native-module-mock.utils.ts \
        src/__tests__/integration/adapty-handler/activation.test.ts \
        src/__tests__/integration/adapty-handler/profile.test.ts \
        src/__tests__/integration/adapty-handler/products.test.ts \
        src/__tests__/integration/adapty-handler/paywall.test.ts \
        src/__tests__/integration/adapty-handler/purchase.test.ts \
        src/__tests__/integration/adapty-handler/purchase-event.test.ts \
        src/__tests__/integration/adapty-handler/README.md

git commit -m "refactor: migrate native mock utils to options API

Refactor all utility functions to use options object with named parameters:

Before (positional arguments):
- extractNativeRequest(mock, callIndex)
- expectNativeCall(mock, method, request, callIndex)
- emitNativeEvent(eventName, eventData)

After (options object):
- extractNativeRequest({ nativeModule, callIndex? })
- expectNativeCall({ nativeModule, method, expectedRequest, callIndex? })
- emitNativeEvent({ eventName, eventData })

Benefits:
- Self-documenting code with named parameters
- Consistent API across all utility functions
- callIndex optional with default = 0
- Easier to extend with new options in future
- TypeScript enforces correct property names

Changes:
- Updated function signatures in native-module-mock.utils.ts
- Updated ~30 call sites across 6 test files
- Updated documentation examples in README.md

All 48 tests passing ✅"
```

---

## Implementation Notes

### Migration Strategy

**Atomic refactoring:**
- All changes in one commit
- Easier to review as single cohesive change
- Either everything works or nothing (no partial state)

**Call site migration:**
- Update utilities first (will break tests)
- Update test files one by one
- Verify each file compiles and tests pass
- Single final commit with all changes

### Expected Changes

**Function signatures:**
- 3 functions updated to options API
- 3 new interface types added

**Call sites:**
- activation.test.ts: ~14 updates
- profile.test.ts: ~3 updates
- products.test.ts: ~2 updates
- paywall.test.ts: ~5 updates
- purchase.test.ts: ~3 updates
- purchase-event.test.ts: ~1 update
- **Total: ~28-30 call sites**

**Documentation:**
- README.md: ~5-10 example updates
- JSDoc: Updated for all 3 functions

### Potential Issues

**Issue:** Tests fail after utilities update

**Solution:** Complete all test file updates before running full suite

**Issue:** TypeScript errors in unused parameters

**Solution:** Prefix with underscore if needed

**Issue:** Missed some call sites

**Solution:** TypeScript will show errors, grep to find remaining

### Validation Steps

1. ✅ TypeScript compilation succeeds
2. ✅ All 48 tests pass
3. ✅ No linting errors
4. ✅ Documentation examples updated
5. ✅ Consistent API across all functions

## Success Criteria

Refactoring complete when:

1. ✅ All 3 utility functions use options API
2. ✅ All ~30 call sites updated
3. ✅ All 48 tests passing
4. ✅ TypeScript compiles without errors
5. ✅ README.md examples updated
6. ✅ Single atomic commit created
7. ✅ API is consistent across all functions
