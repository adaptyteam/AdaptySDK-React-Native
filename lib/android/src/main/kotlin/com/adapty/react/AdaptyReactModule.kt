package com.adapty.react

import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyReactModule(reactContext: ReactApplicationContext):
    ReactContextBaseJavaModule(reactContext) {
    val helper = CrossplatformHelper.create()
    val ctx = reactContext
    private val callHandler = AdaptyCallHandler(helper, reactContext)
    private var listenerCount = 0

    override fun getName(): String {
        return "RNAdapty"
    }

    private fun sendEvent(reactContext: ReactContext, eventName: String, params: String) {
        if (listenerCount == 0) {
            return
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        if (listenerCount == 0) {
            Adapty.setOnProfileUpdatedListener { profile ->
                sendEvent(ctx,
                    ON_LATEST_PROFILE_LOAD,
                    profile.let(helper::toJson)
                )
            }
        }

        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        listenerCount -= 1

        if (listenerCount == 0) {
            Adapty.setOnProfileUpdatedListener (null)
        }
    }

    @ReactMethod
    fun handle(methodName: String, args: ReadableMap, promise: Promise) {
        callHandler.handle(methodName, args, promise, currentActivity)
    }
}