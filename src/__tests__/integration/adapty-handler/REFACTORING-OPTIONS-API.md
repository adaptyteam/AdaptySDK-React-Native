# Native Module Mock Utils - Options API Refactoring

**Date:** 2026-02-03
**Status:** Design Complete
**Author:** Claude (with Stanislav Mayorov)

## Problem Statement

Current utility functions in `native-module-mock.utils.ts` use positional arguments, which creates readability issues:

1. **`extractNativeRequest(mock, callIndex)`** - 2 arguments, callIndex purpose not obvious
2. **`expectNativeCall(mock, method, request, callIndex)`** - 4 arguments, hard to remember order
3. **`emitNativeEvent(eventName, eventData)`** - 2 arguments, order not obvious

**Issues:**
- Hard to remember argument order, especially for `expectNativeCall` (4 args)
- Not self-documenting - need to check function signature
- Difficult to add new optional parameters without breaking API
- Inconsistent readability across codebase

## Goals

Refactor all utility functions to use **options object pattern** with named parameters:

1. ✅ Improve readability - self-documenting code
2. ✅ Consistent API - all functions follow same pattern
3. ✅ Maintainability - easier to add new options in future
4. ✅ Type safety - TypeScript enforces correct property names

## Solution

### New API Signatures

**Before:**
```typescript
extractNativeRequest<T>(mock: MockNativeModule, callIndex: number = 0): T
expectNativeCall<T>(mock: MockNativeModule, method: string, request: T, callIndex: number = 0): void
emitNativeEvent(eventName: string, eventData: any): void
```

**After:**
```typescript
extractNativeRequest<T>(options: {
  nativeModule: MockNativeModule;
  callIndex?: number; // default = 0
}): T

expectNativeCall<T>(options: {
  nativeModule: MockNativeModule;
  method: string;
  expectedRequest: T;
  callIndex?: number; // default = 0
}): void

emitNativeEvent(options: {
  eventName: string;
  eventData: any;
}): void
```

### Design Decisions

**Parameter name: `nativeModule`**
- Chosen over: `mock`, `spy`, `from`, `target`
- Rationale: Most descriptive, clear what the object represents
- Avoids redundancy: `mock: nativeMock` → `nativeModule: nativeMock`

**Optional `callIndex`**
- Default value: 0 (first call)
- Rationale: Most common case is checking first call
- Can omit when checking first call, explicit when checking others

**Breaking change approach**
- Chosen over: gradual migration with overloads
- Rationale: Simpler implementation, cleaner codebase, easier to review
- All changes in one PR for atomic refactoring

## Migration Scope

### Files to Modify

**Core utilities (1 file):**
- `native-module-mock.utils.ts` - Update function signatures

**Test files (6 files):**
- `activation.test.ts` - ~14 call sites
- `profile.test.ts` - ~3 call sites
- `products.test.ts` - ~2 call sites
- `paywall.test.ts` - ~5 call sites
- `purchase.test.ts` - ~3 call sites
- `purchase-event.test.ts` - ~1 call site

**Documentation (2 files):**
- `README.md` - Update examples
- `DESIGN.md` - Update examples (optional)

**Total:** 9 files, ~30-40 call sites

## Examples

### extractNativeRequest

**Before:**
```typescript
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>(nativeMock, 1);
```

**After:**
```typescript
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock,
  callIndex: 1
});

// Or omit callIndex for first call (0)
const request = extractNativeRequest<
  components['requests']['Activate.Request']
>({
  nativeModule: nativeMock
});
```

### expectNativeCall

**Before:**
```typescript
expectNativeCall(nativeMock, 'activate', ACTIVATE_REQUEST_MINIMAL, 0);

expectNativeCall(
  nativeMock,
  'update_profile',
  UPDATE_PROFILE_REQUEST_CUSTOM_ATTRS,
  1
);
```

**After:**
```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL
  // callIndex: 0 omitted (default)
});

expectNativeCall({
  nativeModule: nativeMock,
  method: 'update_profile',
  expectedRequest: UPDATE_PROFILE_REQUEST_CUSTOM_ATTRS,
  callIndex: 1
});
```

### emitNativeEvent

**Before:**
```typescript
emitNativeEvent('did_load_latest_profile', EVENT_DID_LOAD_LATEST_PROFILE);
```

**After:**
```typescript
emitNativeEvent({
  eventName: 'did_load_latest_profile',
  eventData: EVENT_DID_LOAD_LATEST_PROFILE
});
```

## Benefits

### Readability

**Before (hard to understand):**
```typescript
expectNativeCall(nativeMock, 'activate', ACTIVATE_REQUEST_MINIMAL, 0);
// What is 0? First call? Timeout? Index?
```

**After (self-documenting):**
```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL,
  callIndex: 0  // Clear: checking first call
});
```

### Extensibility

Easy to add new options in future:

```typescript
// Future: add strict mode
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedRequest: ACTIVATE_REQUEST_MINIMAL,
  callIndex: 0,
  strict: true  // New option, no breaking change
});
```

### Type Safety

TypeScript enforces correct property names:

```typescript
expectNativeCall({
  nativeModule: nativeMock,
  method: 'activate',
  expectedReques: ACTIVATE_REQUEST_MINIMAL, // ← Typo, TypeScript error!
  callIndex: 0
});
```

## Trade-offs

### Advantages

1. ✅ Self-documenting code
2. ✅ Consistent API across all functions
3. ✅ Easy to extend with new options
4. ✅ TypeScript catches typos in property names
5. ✅ No confusion about argument order

### Disadvantages

1. ❌ More verbose - each call takes more lines
2. ❌ Need to update ~30-40 call sites
3. ❌ Breaking change - can't gradually migrate

### Mitigation

- **More verbose:** Trade-off for clarity, worth it
- **Update call sites:** Automated with find/replace + manual verification
- **Breaking change:** All in one PR, easier to review than gradual migration

## Success Criteria

Refactoring complete when:

1. ✅ All 3 functions use options object pattern
2. ✅ All ~30-40 call sites updated
3. ✅ All 48 tests still passing
4. ✅ TypeScript compilation successful
5. ✅ Documentation (README.md) updated
6. ✅ No breaking changes in test behavior (only API signatures)
7. ✅ Consistent naming (`nativeModule`) across all functions

## Implementation Strategy

1. Update function signatures in `native-module-mock.utils.ts`
2. Update all test files one by one
3. Update documentation
4. Verify all tests pass
5. Single commit with all changes (atomic refactoring)

## Risk Assessment

**Low Risk:**
- Pure refactoring - no logic changes
- All tests must pass - validation built-in
- TypeScript catches signature mismatches
- Breaking change isolated to test utilities (not public API)

**Validation:**
- Run `yarn test` after changes
- Run `yarn tsc --noEmit` to verify types
- Check test count matches (48 tests)
