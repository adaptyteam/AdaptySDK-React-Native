# UI Tests Migration Analysis - enableMock vs NativeModuleMock

**Date:** 2026-02-04
**Status:** Analysis Complete

## Current Situation

### UI Tests Architecture

**Current approach:** UI tests use **MockRequestHandler** (enableMock: true)

```
UI Test
  → createOnboardingViewController()
    → createAdaptyInstance() from adapty-handler-mock-web/setup.utils.ts
      → adapty.enableMock(true, mockConfig)
        → MockRequestHandler created
  → emitOnboardingCloseEvent()
    → $bridge.testBridge.testEmitter.emit()  ← MockRequestHandler's testEmitter
```

**Files:**
- `src/__tests__/integration/ui/setup.utils.ts` - UI-specific setup (uses adapty-handler-mock-web)
- `src/__tests__/integration/adapty-handler-mock-web/setup.utils.ts` - Old MockStore approach
- UI tests: 4 files, 4248 lines total

**Key point:** UI tests use `$bridge.testBridge.testEmitter` to emit events. This works ONLY with MockRequestHandler, not NativeModuleMock.

### adapty-handler Tests Architecture

**Current approach:** adapty-handler tests use **NativeModuleMock** (enableMock: false)

```
adapty-handler Test
  → createNativeModuleMock()
    → Mocks NativeModules.RNAdapty
      → NativeRequestHandler created
  → emitNativeEvent()
    → getTestEmitter().emit()  ← Global TestEventEmitter
```

**Files:**
- `src/__tests__/integration/adapty-handler/setup.utils.ts` - NativeModuleMock approach
- `src/__tests__/integration/adapty-handler/native-module-mock.utils.ts` - Utilities
- adapty-handler tests: 6 files, 24 tests

## Key Difference

| Aspect | UI Tests (Current) | adapty-handler Tests (New) |
|--------|-------------------|---------------------------|
| Approach | MockRequestHandler | NativeModuleMock |
| Bridge | `$bridge.testBridge` | `NativeModules.RNAdapty` |
| Event Emitter | `testBridge.testEmitter` | `getTestEmitter()` |
| Setup | `enableMock: true` | `createNativeModuleMock()` |
| What it tests | Event parsing from MockRequestHandler | Bridge communication with native |

## Problem

**UI tests need MockRequestHandler.testEmitter for event emission:**

```typescript
// ui/paywall/paywall-event-emitter.utils.ts:18-28
const bridge = $bridge.testBridge;  // ← MockRequestHandler instance
const emitter = (bridge as any).testEmitter;  // ← MockRequestHandler's emitter

emitter.emit('paywall_view_did_select_product', JSON.stringify(payload));
```

**If we migrate to NativeModuleMock:**
- `$bridge.testBridge` will be `NativeRequestHandler` (not MockRequestHandler)
- `NativeRequestHandler` doesn't have `testEmitter`
- All event emission utilities will break

## Migration Scope

### Option 1: Keep UI tests as-is (RECOMMENDED)

**Rationale:**
- UI tests focus on **event parsing** (snake_case → camelCase through MockRequestHandler)
- adapty-handler tests focus on **bridge communication** (request/response format)
- Different test purposes, different approaches make sense

**Changes needed:** NONE

**Pros:**
- No breaking changes to 4248 lines of UI tests
- MockRequestHandler still valid for testing event parsing
- Clear separation: UI tests = event parsing, adapty-handler = bridge communication

**Cons:**
- Two different testing approaches in codebase
- adapty-handler-mock-web still uses old MockStore approach

### Option 2: Migrate UI tests to NativeModuleMock (NOT RECOMMENDED)

**Changes needed:**

1. **Update setup.utils.ts** (both UI and adapty-handler-mock-web)
   - Remove `enableMock: true, mockConfig`
   - Use `createNativeModuleMock()` from adapty-handler utils

2. **Update event-emitter utilities** (2 files)
   - Replace `$bridge.testBridge.testEmitter` with `getTestEmitter()`
   - Update all emit functions (~12 functions)

3. **Update all UI tests** (4 files, 4248 lines)
   - Update imports
   - Update setup in beforeEach
   - Potentially update event samples

4. **Migrate adapty-handler-mock-web tests** (6 files)
   - These are duplicates of adapty-handler tests but use enableMock
   - Need full migration like Phase 1 and Phase 2

**Scope:** ~5000+ lines of code changes, high risk

**Pros:**
- Unified testing approach
- Remove adapty-handler-mock-web duplication

**Cons:**
- Massive refactoring (4248 lines in UI + adapty-handler-mock-web tests)
- High risk of breaking working tests
- UI tests currently work perfectly - "if it ain't broke, don't fix it"
- Event emission testing is valid use case for MockRequestHandler

### Option 3: Hybrid approach

**Keep UI tests with MockRequestHandler BUT:**
- Migrate adapty-handler-mock-web to match adapty-handler (NativeModuleMock)
- Document the difference: UI tests for events, adapty-handler for bridge

**Changes needed:**
- Migrate 6 test files in adapty-handler-mock-web to NativeModuleMock
- Update ui/setup.utils.ts to import from new location
- Keep UI event emission as-is

**Scope:** Medium (only adapty-handler-mock-web migration)

## Recommendation

### ✅ Option 1: Keep UI tests as-is

**Why:**
1. **Different test purposes:**
   - UI tests → Event parsing and ViewController behavior
   - adapty-handler tests → Bridge request/response format

2. **MockRequestHandler is valid for UI tests:**
   - UI tests NEED to emit events to test event handlers
   - MockRequestHandler.testEmitter is designed for this
   - Event emission is the core of what UI tests do

3. **Risk vs benefit:**
   - Risk: Breaking 4248 lines of working tests
   - Benefit: Unified approach (but at what cost?)
   - Not worth it

4. **Clean separation:**
   - `src/__tests__/integration/adapty-handler` → Bridge communication tests (NativeModuleMock)
   - `src/__tests__/integration/ui` → Event parsing tests (MockRequestHandler)
   - `src/__tests__/integration/adapty-handler-mock-web` → Legacy MockStore tests (can be removed or kept)

## Conclusion

**No migration needed for UI tests.**

UI tests should continue using MockRequestHandler because:
- They test event emission and parsing, not bridge communication
- MockRequestHandler.testEmitter is the right tool for event testing
- Working tests shouldn't be refactored without clear benefit

**Possible action:** Document the difference in README to avoid confusion.

---

## If Migration Still Desired

See separate plan: `UI-TESTS-MIGRATION-PLAN.md` (to be created if needed)

Estimated effort: 20-30 hours, high risk
