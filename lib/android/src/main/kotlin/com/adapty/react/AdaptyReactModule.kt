package com.adapty.react

import com.adapty.internal.crossplatform.CrossplatformHelper
import com.facebook.react.bridge.*

class AdaptyReactModule(reactContext: ReactApplicationContext):
    ReactContextBaseJavaModule(reactContext) {
    private val callHandler = AdaptyCallHandler(CrossplatformHelper.create(), currentActivity, reactContext)

    override fun getName(): String {
        return "RNAdapty"
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun handle(methodName: String, args: ReadableMap, promise: Promise) {
        callHandler.handle(methodName, args, promise)
    }
}