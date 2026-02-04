# Adapty Handler Integration Tests

This directory contains integration tests for Adapty SDK core functionality, verifying the complete bridge communication path between JavaScript and native modules.

## Overview

These tests verify that the SDK correctly:
1. **Encodes** JavaScript parameters to native format (camelCase → snake_case)
2. **Sends** properly formatted JSON requests to the native bridge
3. **Receives** and **parses** native responses back to JavaScript format (snake_case → camelCase)

All request/response formats are **strictly typed** against `src/types/api.d.ts`, which is generated from the cross-platform API specification (`cross_platform.yaml`).

## Architecture

### What These Tests Verify

```
JS: adapty.activate
  → AdaptyConfigurationCoder (encode)
    → snake_case JSON
  → NativeRequestHandler
    → Native Module Mock (spied)
  → JSON Response
    → parseMethodResult (decode)
  → JS: camelCase result
```

**Key verification points:**
- ✅ Request JSON matches `components['requests']['{Method}.Request']` type
- ✅ Native module receives correctly formatted data
- ✅ Response JSON matches `components['requests']['{Method}.Response']` type
- ✅ Result is properly decoded to JavaScript format

### What These Tests DON'T Test

❌ Actual native SDK behavior 
❌ React Native environment setup
❌ Real network requests

## File Structure

```
src/__tests__/integration/adapty-handler/
├── README.md                           # This file
├── DESIGN.md                          # Design document
├── activation.test.ts                  # Activation flow tests
├── bridge-samples.ts                   # Typed request/response samples
├── native-module-mock.utils.ts         # Native module mocking utilities
├── setup.utils.ts                      # Test setup helpers
└── helpers.utils.ts                    # Generic test helpers
```

## Migration Status

✅ **Phase 1 Complete** - Activation tests migrated (14 tests)
✅ **Phase 2 Complete** - All remaining tests migrated

**Migrated files:**
- activation.test.ts (14 tests) - Activation flow
- profile.test.ts (1 test) - Profile operations
- products.test.ts (1 test) - Paywall products
- paywall.test.ts (5 tests) - Paywall retrieval
- purchase.test.ts (2 tests) - Purchase flow
- purchase-event.test.ts (1 test) - Purchase events

**Total:** 24 tests, all using NativeModuleMock spy approach

## Core Components

### 1. Bridge Samples (`bridge-samples.ts`)

Contains typed examples of native bridge requests and responses:

```typescript
import type { components } from '@/types/api';

// ✅ TypeScript enforces correct structure
export const ACTIVATE_REQUEST_MINIMAL: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
  },
};
```

**Benefits:**
- Type safety: If `api.d.ts` changes, samples break at compile time
- Documentation: Shows exact format expected by native bridge
- Reusability: Same samples can be used across multiple tests

### 2. Native Module Mock Utilities (`native-module-mock.utils.ts`)

Provides functions to mock and spy on native module calls.

#### `createNativeModuleMock(responses)`

Creates a mocked `RNAdapty` native module with predefined responses:

```typescript
const nativeMock = createNativeModuleMock({
  activate: { success: true },
  is_activated: { success: true },
});
```

#### `extractNativeRequest<T>(options)`

Extracts and parses the request sent to native module:

```typescript
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock
});

expect(request.configuration.api_key).toBe('test_key');
```

#### `expectNativeCall(options)`

Verifies that native module was called with correct parameters:

```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL
});
```

#### `resetNativeModuleMock(mock)`

Clears mock call history for next test.

## Writing Tests

### Basic Test Structure

```typescript
describe('Feature Name', () => {
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

  it('should do something', async () => {
    // Setup: create mock with expected response
    nativeMock = createNativeModuleMock({
      method_name: EXPECTED_RESPONSE,
    });

    // Execute: call SDK method
    await adapty.someMethod();

    // Verify: check native was called correctly
    expectNativeCall({
      nativeModule: nativeMock,
      method: 'method_name',
      expectedRequest: EXPECTED_REQUEST
    });
  });
});
```

### Testing Request Format

```typescript
it('should send parameters in snake_case', async () => {
  nativeMock = createNativeModuleMock({
    activate: { success: true },
  });

  // Call with camelCase parameters
  await adapty.activate('key', {
    customerUserId: 'user_123',
    observerMode: true,
  });

  // Extract what was sent to native
  const request = extractNativeRequest<
    components['requests']['Activate.Request']
  >({
    nativeModule: nativeMock
  });

  // Verify: snake_case format
  expect(request.configuration.customer_user_id).toBe('user_123');
  expect(request.configuration.observer_mode).toBe(true);
});
```

### Testing Error Handling

```typescript
it('should throw AdaptyError on native error', async () => {
  const errorResponse: components['requests']['Activate.Response'] = {
    error: {
      adapty_code: 2002,
      message: 'Invalid API key',
    },
  };

  nativeMock = createNativeModuleMock({
    activate: errorResponse,
  });

  await expect(
    adapty.activate('invalid_key'),
  ).rejects.toMatchObject({
    adaptyCode: 2002,
  });
});
```

## Type Safety

### Using Explicit Types

Always use explicit types from `api.d.ts` for type safety:

```typescript
// ✅ Good: Explicit type from api.d.ts
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock
});
```

### Creating New Samples

When creating new bridge samples, always type them:

```typescript
// ✅ Good: TypeScript enforces structure
export const GET_PROFILE_RESPONSE: components['requests']['GetProfile.Response'] = {
  success: {
    profile_id: 'test_id',
    custom_attributes: {},
  },
};
```

## Running Tests

```bash
# Run all integration tests
yarn test src/__tests__/integration/adapty-handler

# Run specific test file
yarn test src/__tests__/integration/adapty-handler/activation.test.ts

# Run with watch mode
yarn test --watch src/__tests__/integration/adapty-handler

# Run with coverage
yarn test --coverage src/__tests__/integration/adapty-handler
```

## Best Practices

1. **Always use explicit types** from `api.d.ts` for samples and assertions
2. **Reset mocks** in `afterEach` to prevent test pollution
3. **Verify both request and response** formats in each test
4. **Use typed samples** from `bridge-samples.ts` instead of inline objects
5. **Test error cases** as well as success cases
6. **Check field transformations** (snake_case ↔ camelCase) explicitly

## Troubleshooting

### "No mock response registered for method"

**Solution:** Add response to `createNativeModuleMock`:
```typescript
nativeMock = createNativeModuleMock({
  method_name: EXPECTED_RESPONSE,
});
```

### TypeScript error: Type mismatch

**Solution:** Check `api.d.ts` for correct structure.

### Test passes but request format is wrong

**Solution:** Use `expectNativeCall` or `extractNativeRequest` to verify:
```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: EXPECTED_REQUEST
});
```

## Related Documentation

- [Design Document](./DESIGN.md) - Complete design and architecture
- [API Types Reference](../../types/api.d.ts) - Generated from cross_platform.yaml
- [UI Integration Tests](../ui/README.md) - Similar approach for UI events
