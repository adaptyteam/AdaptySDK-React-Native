# Adapty Handler Integration Tests Redesign

**Date:** 2026-02-03
**Status:** Design Complete
**Author:** Claude (with Stanislav Mayorov)

## Problem Statement

Current integration tests in `src/__tests__/integration/adapty-handler` use MockRequestHandler with mockConfig to simulate native bridge behavior. This approach has significant limitations:

1. **No request format verification** - MockStore returns ready-made JS objects, bypassing the encoding/decoding pipeline
2. **No bridge communication testing** - Doesn't verify that SDK sends correct JSON to native bridge
3. **No type safety** - mockConfig is not validated against cross_platform.yaml types
4. **Limited coverage** - Doesn't test coders (AdaptyConfigurationCoder, etc.) or field transformations (camelCase ↔ snake_case)
5. **False confidence** - Tests pass even if bridge communication format is broken

## Goals

Redesign integration tests to:

1. ✅ Test the **full bridge communication path** (JS → encoder → bridge → parser → JS)
2. ✅ Verify **request format** sent to native bridge matches `api.d.ts` (cross_platform.yaml)
3. ✅ Verify **response parsing** from native format (snake_case) to JS format (camelCase)
4. ✅ Use **strict TypeScript types** from `api.d.ts` for compile-time validation
5. ✅ Enable **spy-based assertions** on native module calls
6. ✅ Remove dependency on **mockConfig** - use explicit typed samples instead

## Solution Overview

Replace MockRequestHandler approach with **NativeModuleMock spy approach**:

- Mock `NativeModules.RNAdapty` with jest spy
- Use **real NativeRequestHandler** (enableMock: false)
- Return typed responses from `api.d.ts`
- Verify requests sent to native match expected format
- Test complete encoding/decoding pipeline

## Architecture

### Current Flow (MockRequestHandler)

```
adapty.activate()
  → MockRequestHandler.request()
    → MockStore.setActivated(true)  ← Returns hardcoded data
  → No encoding/decoding tested
```

### New Flow (NativeModuleMock)

```
adapty.activate()
  → AdaptyConfigurationCoder.encode()  ← Tested
    → camelCase → snake_case
  → NativeRequestHandler.request()
    → NativeModules.RNAdapty.handler()  ← Spied & verified
      → Receives: { method: 'activate', params: { args: JSON } }
      → Returns: JSON string response
  → parseMethodResult()  ← Tested
    → snake_case → camelCase
  → Result
```

## Key Components

### 1. Typed Bridge Samples

**File:** `src/__tests__/integration/adapty-handler/bridge-samples.ts`

Contains strictly typed request/response samples:

```typescript
import type { components } from '@/types/api';

export const ACTIVATE_REQUEST_MINIMAL: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
  },
};

export const ACTIVATE_RESPONSE_SUCCESS: components['requests']['Activate.Response'] = {
  success: true,
};
```

**Benefits:**
- TypeScript enforces correct structure at compile time
- If `api.d.ts` changes, samples break (fail-fast)
- Self-documenting - shows exact bridge format
- Reusable across tests

### 2. Native Module Mock Utilities

**File:** `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`

Provides utilities for mocking native module:

#### `createNativeModuleMock(responses)`

Creates mocked `NativeModules.RNAdapty` with response registry:

```typescript
const nativeMock = createNativeModuleMock({
  activate: { success: true },
  is_activated: { success: true },
});
```

#### `extractNativeRequest<T>(mock, callIndex)`

Extracts and parses request sent to native:

```typescript
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>(nativeMock, 0);
```

#### `expectNativeCall(mock, method, expectedRequest, callIndex)`

Asserts native was called with correct format:

```typescript
expectNativeCall(
  nativeMock,
  'activate',
  ACTIVATE_REQUEST_MINIMAL,
  0
);
```

### 3. Updated Setup Utilities

**File:** `src/__tests__/integration/adapty-handler/setup.utils.ts`

Simplified setup without mockConfig:

```typescript
export async function createAdaptyInstance(): Promise<{
  adapty: Adapty;
  nativeMock: MockNativeModule;
}> {
  resetBridge();

  const nativeMock = createNativeModuleMock({
    activate: ACTIVATE_RESPONSE_SUCCESS,
    is_activated: IS_ACTIVATED_RESPONSE_TRUE,
  });

  const adapty = new Adapty();
  await adapty.activate('test_api_key', { logLevel: 'error' });

  return { adapty, nativeMock };
}
```

## Test Structure

### Basic Test Pattern

```typescript
describe('Feature', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(() => {
    resetBridge();
    adapty = new Adapty();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('should send correct request format', async () => {
    // Setup: mock with typed response
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
    });

    // Execute: call SDK method
    await adapty.activate('test_api_key');

    // Verify: request format matches api.d.ts
    expectNativeCall(
      nativeMock,
      'activate',
      ACTIVATE_REQUEST_MINIMAL,
      0
    );
  });
});
```

## What Gets Tested

### 1. Request Encoding

Verify SDK encodes JS parameters to native format:

```typescript
it('should encode camelCase to snake_case', async () => {
  nativeMock = createNativeModuleMock({
    activate: { success: true },
  });

  await adapty.activate('key', {
    customerUserId: 'user_123',  // JS: camelCase
    observerMode: true,
  });

  const request = extractNativeRequest<
    components['requests']['Activate.Request']
  >(nativeMock, 0);

  // Native: snake_case
  expect(request.configuration.customer_user_id).toBe('user_123');
  expect(request.configuration.observer_mode).toBe(true);
});
```

### 2. Response Parsing

Verify SDK parses native responses to JS format:

```typescript
it('should parse snake_case to camelCase', async () => {
  nativeMock = createNativeModuleMock({
    get_profile: {
      success: {
        profile_id: 'test_id',
        custom_attributes: { key: 'value' },
        paid_access_levels: {},
      },
    },
  });

  const profile = await adapty.getProfile();

  // JS: camelCase
  expect(profile.profileId).toBe('test_id');
  expect(profile.customAttributes).toEqual({ key: 'value' });
  expect(profile.accessLevels).toBeDefined();
});
```

### 3. Error Handling

Verify SDK correctly handles native errors:

```typescript
it('should throw AdaptyError on native error', async () => {
  nativeMock = createNativeModuleMock({
    activate: {
      error: {
        adapty_code: 2002,
        message: 'Invalid API key',
      },
    },
  });

  await expect(
    adapty.activate('invalid_key'),
  ).rejects.toMatchObject({
    adaptyCode: 2002,  // camelCase in JS
    message: 'Invalid API key',
  });
});
```

### 4. Type Safety

Verify types are enforced at compile time:

```typescript
it('should have strictly typed request', async () => {
  const request = extractNativeRequest<
    components['requests']['Activate.Request']
  >(nativeMock, 0);

  // TypeScript enforces these exist
  const _method: 'activate' = request.method;
  const _apiKey: string = request.configuration.api_key;

  // TypeScript errors on non-existent fields
  // @ts-expect-error
  const _invalid = request.configuration.nonExistent;
});
```

## Migration Strategy

### Phase 1: activation.test.ts (Proof of Concept)

1. Create `bridge-samples.ts` with Activate request/response types
2. Create `native-module-mock.utils.ts` with mocking utilities
3. Rewrite `activation.test.ts` using new approach
4. Verify all tests pass
5. Get feedback on approach

### Phase 2: Remaining Test Files

Once activation.test.ts is validated:

1. Add samples for GetProfile, MakePurchase, etc. to `bridge-samples.ts`
2. Migrate `profile.test.ts`
3. Migrate `purchase.test.ts`
4. Migrate `products.test.ts`
5. Migrate `paywall.test.ts`
6. Migrate `purchase-event.test.ts`

### Phase 3: Documentation & Cleanup

1. Create comprehensive README.md in test directory
2. Remove old MockStore-dependent code if no longer needed
3. Update main project documentation

## Files to Create/Modify

### New Files

- ✅ `src/__tests__/integration/adapty-handler/bridge-samples.ts`
- ✅ `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts`
- ✅ `src/__tests__/integration/adapty-handler/README.md`

### Modified Files

- ✅ `src/__tests__/integration/adapty-handler/activation.test.ts` - Complete rewrite
- ✅ `src/__tests__/integration/adapty-handler/setup.utils.ts` - Remove mockConfig
- ⏳ `src/__tests__/integration/adapty-handler/profile.test.ts` - Phase 2
- ⏳ `src/__tests__/integration/adapty-handler/purchase.test.ts` - Phase 2
- ⏳ `src/__tests__/integration/adapty-handler/products.test.ts` - Phase 2
- ⏳ `src/__tests__/integration/adapty-handler/paywall.test.ts` - Phase 2
- ⏳ `src/__tests__/integration/adapty-handler/purchase-event.test.ts` - Phase 2

### Files to Remove (Optional)

- `src/__tests__/integration/adapty-handler/helpers.utils.ts` - May be obsolete
- Consider removing if no longer needed after migration

## Benefits

### Compared to Old Approach

| Aspect | Old (MockStore) | New (NativeModuleMock) |
|--------|-----------------|------------------------|
| **Bridge testing** | ❌ No | ✅ Yes |
| **Request verification** | ❌ No | ✅ Yes |
| **Response parsing** | ❌ No | ✅ Yes |
| **Type safety** | ❌ Runtime only | ✅ Compile-time |
| **Coder testing** | ❌ No | ✅ Yes |
| **Field transformations** | ❌ Not tested | ✅ Explicitly tested |
| **Spy capabilities** | ❌ Limited | ✅ Full jest spy |
| **Maintenance** | ❌ MockStore divergence | ✅ Tied to api.d.ts |

### Type Safety Benefits

- **Compile-time errors** if bridge format changes
- **IDE autocomplete** when creating samples
- **Refactoring safety** - TypeScript finds all usages
- **Documentation** - types show exact contract

### Testing Coverage

- **Encoding pipeline** - camelCase → snake_case transformation
- **Decoding pipeline** - snake_case → camelCase transformation
- **Coders** - AdaptyConfigurationCoder, AdaptyProfileCoder, etc.
- **Bridge format** - Exact JSON structure sent/received
- **Error handling** - Native error parsing and transformation

## Trade-offs

### Advantages

1. ✅ Real bridge communication testing
2. ✅ Type-safe samples tied to api.d.ts
3. ✅ Spy on actual native calls
4. ✅ Test full encoding/decoding pipeline
5. ✅ Fail-fast on format changes

### Disadvantages

1. ❌ More boilerplate (create mocks, samples)
2. ❌ Tests are more verbose
3. ❌ Need to maintain bridge-samples.ts
4. ❌ Requires understanding of native bridge format

### Mitigation

- **Utilities reduce boilerplate** - `createNativeModuleMock`, `expectNativeCall`
- **Samples are reusable** - Write once, use in many tests
- **Documentation helps** - Comprehensive README.md
- **TypeScript helps** - Autocomplete and error checking

## Example Test Comparison

### Old Approach

```typescript
it('should activate SDK', async () => {
  const adapty = await createAdaptyInstance({
    premiumAccessLevelId: 'premium',  // mockConfig
  });

  const isActivated = await adapty.isActivated();
  expect(isActivated).toBe(true);
});
```

**Problems:**
- No request verification
- MockStore black box
- No type safety
- Doesn't test encoding

### New Approach

```typescript
it('should send correct Activate.Request', async () => {
  nativeMock = createNativeModuleMock({
    activate: ACTIVATE_RESPONSE_SUCCESS,
    is_activated: IS_ACTIVATED_RESPONSE_TRUE,
  });

  await adapty.activate('test_api_key');

  // Verify request format
  expectNativeCall(
    nativeMock,
    'activate',
    ACTIVATE_REQUEST_MINIMAL,
    0
  );

  // Verify result
  const isActivated = await adapty.isActivated();
  expect(isActivated).toBe(true);
});
```

**Benefits:**
- ✅ Verifies request format
- ✅ Tests encoding pipeline
- ✅ Type-safe samples
- ✅ Spy on native calls

## Success Criteria

### Phase 1 Complete When:

1. ✅ `activation.test.ts` rewritten with new approach
2. ✅ All activation tests pass
3. ✅ Request format verified in tests
4. ✅ Type safety demonstrated
5. ✅ README.md created with examples
6. ✅ Code review approved

### Full Migration Complete When:

1. ✅ All test files migrated
2. ✅ All tests passing
3. ✅ Coverage maintained or improved
4. ✅ Documentation complete
5. ✅ Old MockStore approach removed (if obsolete)

## Risks & Mitigation

### Risk: Tests become too verbose

**Mitigation:**
- Create helper utilities
- Reuse samples across tests
- Document common patterns

### Risk: Hard to maintain bridge-samples.ts

**Mitigation:**
- Types enforce correctness
- Samples fail at compile time if api.d.ts changes
- Group related samples together

### Risk: Learning curve for new approach

**Mitigation:**
- Comprehensive README.md
- Examples for common scenarios
- Code review and feedback

### Risk: Breaking existing tests

**Mitigation:**
- Migrate one file at a time
- Keep old tests until new ones proven
- Thorough testing before removal

## Timeline Estimate

### Phase 1 (activation.test.ts)
- Setup infrastructure: 2-3 hours
- Write tests: 2-3 hours
- Documentation: 1-2 hours
- **Total: 5-8 hours**

### Phase 2 (Remaining files)
- Per file: 1-2 hours
- 5 files: 5-10 hours
- **Total: 5-10 hours**

### Phase 3 (Cleanup)
- Documentation: 1-2 hours
- Code review & fixes: 2-3 hours
- **Total: 3-5 hours**

**Grand Total: 13-23 hours**

## Next Steps

1. ✅ Review and approve design
2. Create implementation plan
3. Set up git worktree for isolated work
4. Implement Phase 1 (activation.test.ts)
5. Review and iterate
6. Proceed with Phase 2 if approved
7. Complete Phase 3

## References

- [api.d.ts](../../src/types/api.d.ts) - Generated from cross_platform.yaml
- [UI Integration Tests](../../src/__tests__/integration/ui/README.md) - Similar spy approach
- [Current Tests](../../src/__tests__/integration/adapty-handler/) - Code to be migrated
