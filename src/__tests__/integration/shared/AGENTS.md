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
