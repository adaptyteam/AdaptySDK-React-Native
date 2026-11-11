package com.adapty.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

// Old architecture: mirrors the generated NativeRNAdaptySpec (src/specs/NativeRNAdapty.ts).
// Kept in sync by src/__tests__/codegen-spec.test.ts
abstract class AdaptyReactModuleSpec(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    abstract fun handle(method: String, args: ReadableMap, promise: Promise)

    abstract fun addListener(eventName: String)

    abstract fun removeListeners(count: Double)
}
