# Adapty Handler Integration Tests

This directory contains integration tests for Adapty SDK core functionality, verifying the complete bridge communication path between JavaScript and native modules.

## Overview

These tests verify that the SDK correctly:
1. **Encodes** JavaScript parameters to native format (camelCase → snake_case)
2. **Sends** properly formatted JSON requests to the native bridge
3. **Receives** and **parses** native responses back to JavaScript format (snake_case → camelCase)

All request/response formats are **strictly typed** against `src/types/api.d.ts`, which is generated from the cross-platform API specification (`cross_platform.yaml`).

## Shared Utilities

These tests use shared utilities from `../shared/` directory, which are also used by UI integration tests:

- **`native-module-mock.utils.ts`** - NativeModuleMock creation, request extraction, native call assertions
- **`bridge-samples/`** - Typed request/response samples organized by domain (activation, profile, paywall, etc.)

This allows consistent testing approach across all test suites. See [Shared Utilities README](../shared/README.md) for complete documentation.

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

### Relationship with UI Tests

These tests focus on **adapty-handler** (core SDK) methods. Similar bridge communication tests exist for **UI methods** in `../ui/`:

- **`ui/paywall/methods/`** - Tests for `adapty_ui_create_paywall_view`, `adapty_ui_present_paywall_view`, etc.
- **`ui/onboarding/methods/`** - Tests for `adapty_ui_create_onboarding_view`, etc.

Both test suites use the same **NativeModuleMock** approach and **shared utilities** from `../shared/`.

**Note:** UI tests also include `ui/*/events/` directories that test event emission using a different approach (MockRequestHandler), which is appropriate for testing native → JS event flow.

## File Structure

```
src/__tests__/integration/adapty-handler/
├── README.md                           # This file
├── DESIGN.md                          # Design document
├── setup.utils.ts                      # Test cleanup helpers
├── activation.test.ts                  # Activation flow (14 tests)
├── profile.test.ts                     # Profile operations (2 tests)
├── products.test.ts                    # Paywall products (2 tests)
├── paywall.test.ts                     # Paywall retrieval (8 tests)
├── purchase.test.ts                    # Purchase flow (2 tests)
├── purchase-event.test.ts              # Purchase events (1 test)
├── onboarding.test.ts                  # Onboarding (3 tests)
├── user-management.test.ts             # Identify/logout (3 tests)
├── restore-purchases.test.ts           # Restore purchases (1 test)
├── web-paywall.test.ts                 # Web paywall (2 tests)
├── configuration.test.ts               # Config methods (3 tests)
├── installation.test.ts                # Installation status (4 tests)
├── attribution.test.ts                 # Attribution (3 tests)
├── ios-specific.test.ts                # iOS methods (6 tests)
├── platform-parameters.test.ts         # Platform params (4 tests)
├── event-listeners.test.ts             # Event handlers (5 tests)
└── bridge-samples-event-adapty-handler.ts  # Real event payloads from native logs
                                            # (Used by event-listeners.test.ts)

Shared utilities (used by all test suites):
├── ../shared/native-module-mock.utils.ts   # NativeModuleMock utilities
└── ../shared/bridge-samples/               # Typed request/response samples
    ├── index.ts                            # Barrel export
```

## Core Components

All shared utilities and bridge samples have been moved to `../shared/` directory for reuse across test suites (adapty-handler and UI tests).

### 1. Shared Bridge Samples (`../shared/bridge-samples/`)

Typed examples of native bridge requests and responses, organized by domain:

```typescript
import {
  ACTIVATE_REQUEST_MINIMAL,
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PROFILE_REQUEST,
  GET_PAYWALL_RESPONSE,
} from '../shared/bridge-samples';

// All samples are strictly typed against api.d.ts:
// type: components['requests']['Activate.Request']
```

**Available sample modules:**
- `activation.ts` - Activate, IsActivated
- `profile.ts` - GetProfile, UpdateProfile
- `paywall.ts` - GetPaywall, LogShowPaywall
- `purchase.ts` - MakePurchase, RestorePurchases
- `onboarding.ts` - GetOnboarding methods
- `user-management.ts` - Identify, Logout
- `configuration.ts` - SetLogLevel, SetFallbackPaywalls
- `installation.ts` - GetInstallationStatus
- `ios-specific.ts` - iOS-only methods
- `events.ts` - Native event payloads
- `common.ts` - Common types and utilities
- `ui-methods.ts` - UI methods (used by UI tests)

**Benefits:**
- Type safety: If `api.d.ts` changes, samples break at compile time
- Reusability: Shared across adapty-handler and UI test suites
- Organization: Domain-specific modules, easy to find

See [Shared Utilities README](../shared/README.md) for complete documentation.

### 2. Native Module Mock Utilities (`../shared/native-module-mock.utils.ts`)

Provides functions to mock and spy on native module calls:

```typescript
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  emitNativeEvent,
} from '../shared/native-module-mock.utils';
```

**Key functions:**
- `createNativeModuleMock(responses)` - Creates mocked RNAdapty with predefined responses
- `extractNativeRequest<T>(options)` - Extracts and parses request sent to native
- `expectNativeCall(options)` - Verifies native was called with correct parameters
- `resetNativeModuleMock(mock)` - Clears mock call history
- `emitNativeEvent(options)` - Emits native event for testing event listeners

See [Shared Utilities README](../shared/README.md) for detailed API documentation.

## Writing Tests

See existing test files for examples. Basic structure:

```typescript
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  expectNativeCall,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import { ACTIVATE_RESPONSE_SUCCESS } from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

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

  it('should test something', async () => {
    nativeMock = createNativeModuleMock({
      method_name: EXPECTED_RESPONSE,
    });

    await adapty.someMethod();

    expectNativeCall({
      nativeModule: nativeMock,
      method: 'method_name',
      expectedRequest: EXPECTED_REQUEST
    });
  });
});
```

**Key patterns:**
- Use `extractNativeRequest<T>()` to inspect request sent to native
- Use `expectNativeCall()` to verify request matches expected format
- Always type requests/responses with `components['requests']['Method.Request']` from `api.d.ts`
- Import typed samples from `../shared/bridge-samples`

## Type Safety

All bridge samples are strictly typed using `components['requests']` types from `api.d.ts`. When creating new samples, add them to the appropriate domain file in `../shared/bridge-samples/` and export from `index.ts`.

TypeScript compilation ensures that samples match the API specification - if `api.d.ts` changes, incompatible samples will fail at compile time.

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
4. **Use typed samples** from `../shared/bridge-samples` instead of inline objects
5. **Test error cases** as well as success cases
6. **Check field transformations** (snake_case ↔ camelCase) explicitly
7. **Import from shared** - Use `../shared/native-module-mock.utils` and `../shared/bridge-samples` for all utilities

## Troubleshooting

- **"No mock response registered for method"** - Add response to `createNativeModuleMock({ method_name: RESPONSE })`
- **TypeScript type mismatch** - Check `api.d.ts` for correct request/response structure
- **Request format incorrect** - Use `expectNativeCall()` or `extractNativeRequest()` to verify actual format sent to native
- **Tests fail after api.d.ts update** - Update bridge samples to match new API specification

## Related Documentation

- [Design Document](./DESIGN.md) - Complete design and architecture
- [Shared Utilities README](../shared/README.md) - Documentation for shared test utilities
- [API Types Reference](../../../types/api.d.ts) - Generated from cross_platform.yaml
- [UI Integration Tests](../ui/README.md) - Similar approach for UI methods and events
