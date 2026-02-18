# Integration Tests Architecture

## Three Test Suites

### `adapty-handler/` — Bridge Protocol Tests
Tests SDK method communication with native: JS (camelCase) → encode → snake_case JSON → Native mock → decode → JS.
Uses `NativeModuleMock` spy to verify exact request format and response parsing.
~50 tests covering activate, profile, purchase, paywall, onboarding, events, etc.

### `adapty-handler-mock-web/` — Business Logic Tests (Mock Mode)
Tests SDK behavior with `enableMock: true` and `MockConfig`.
No bridge inspection — verifies higher-level behavior (profile state, purchase flow).
Uses `createAdaptyInstance(config)` from local `setup.utils.ts`. ~10 tests.

### `ui/` — UI View Controller Tests
Two sub-categories:
- **`*/methods/`** — Bridge communication for UI methods (same pattern as `adapty-handler`)
- **`*/events/`** — Native → JS event flow. Uses mock mode (same as `adapty-handler-mock-web`) to get `testEmitter` from `MockRequestHandler`, emits snake_case JSON events, verifies parsing/transformation and viewId filtering in handlers

## Shared Utilities (`shared/`)

### `bridge-samples/` — Typed Request/Response Fixtures
Organized by domain: `activation.ts`, `profile.ts`, `paywall.ts`, `purchase.ts`, etc.
All samples are **strictly typed** against `api.d.ts` — compile-time validation catches API drift.
Re-exported via `index.ts` barrel.

### `native-module-mock.utils.ts` — NativeModule Mock Factory
`createNativeModuleMock({ method: RESPONSE })` — creates spy on `NativeModules.RNAdapty.handler`.
Returns JSON-stringified responses. Installed into `NativeModules.RNAdapty`.

## Key Testing Patterns

### NativeModuleMock (adapty-handler, ui/methods)
```ts
// Setup
nativeMock = createNativeModuleMock({ activate: ACTIVATE_RESPONSE_SUCCESS });
// Execute
await adapty.activate('key', { logLevel: 'error' });
// Verify request format
expectNativeCall({ nativeModule: nativeMock, method: 'activate', expectedRequest: ACTIVATE_REQUEST_MINIMAL });
// Or extract for detailed inspection
const req = extractNativeRequest<...>({ nativeModule: nativeMock });
expect(req.configuration.log_level).toBe('error');
```

### MockConfig (adapty-handler-mock-web)
```ts
const adapty = await createAdaptyInstance({ premiumAccessLevelId: 'premium', autoGrantPremium: true });
const profile = await adapty.getProfile();
expect(profile.customAttributes).toBeDefined();
```

### Event Emission (ui/events)
```ts
const { view } = await createPaywallViewController();
view.setEventHandlers({ onPurchaseStarted: handler });
emitPaywallPurchaseStartedEvent(viewId, product, view);
expect(handler).toHaveBeenCalledWith(expect.objectContaining({ adaptyId: 'adapty_vip' }));
```

## Data Flow

```
JS API call (camelCase)
  → Coder encodes to snake_case JSON
    → NativeModules.RNAdapty.handler(method, { args: json })
      → Mock returns JSON response
    → parseMethodResult decodes response
  → JS result (camelCase)
```

## Conventions
- Samples use `api.d.ts` types (`components['requests']['Method.Request']`)
- Each `adapty-handler` test creates its own mock for isolation
- `ui/` tests use `createPaywallViewController()` / `createOnboardingViewController()` from local `setup.utils.ts`
- Field transformation (snake_case ↔ camelCase) is verified explicitly in tests
- Cleanup: `adapty.removeAllListeners()` via `cleanupAdapty()`

## Running Tests
```bash
npx jest src/__tests__/integration/adapty-handler    # Bridge protocol tests
npx jest src/__tests__/integration/adapty-handler-mock-web  # Mock mode tests
npx jest src/__tests__/integration/ui                # UI tests
```
