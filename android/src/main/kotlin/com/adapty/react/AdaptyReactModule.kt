package com.adapty.react

import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.utils.FileLocation
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyReactModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var listenerCount = 0

    private val crossplatformHelper by lazy {
        CrossplatformHelper.shared
    }

    override fun initialize() {
        super.initialize()
        CrossplatformHelper.init(
            reactApplicationContext,
            { eventName, eventData ->
                if (listenerCount > 0) {
                    val receiver = reactApplicationContext.getJSModule(
                        DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                    )

                    receiver.emit(
                        eventName,
                        eventData,
                    )
                }
            },
            { value -> FileLocation.extract(value) },
        )
        crossplatformHelper.setActivity { currentActivity }

    }

    override fun getName(): String {
        return "RNAdapty"
    }

    override fun getConstants(): MutableMap<String, Any>? {
        // Name of the function that routes all incoming calls
        return hashMapOf("HANDLER" to "handle")
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        listenerCount -= 1

        if (listenerCount == 0) {
            Adapty.setOnProfileUpdatedListener(null)
        }
    }

    @ReactMethod
    fun handle(methodName: String, args: ReadableMap, promise: Promise) {
        crossplatformHelper.onMethodCall(args.getString("args").orEmpty(), methodName) { data ->
            promise.resolve(data)
        }
    }

    private fun FileLocation.Companion.extract(value: String): FileLocation =
        if (value.lastOrNull() == 'r')
            fromResId(
                reactApplicationContext,
                reactApplicationContext.resources.getIdentifier(
                    value.dropLast(1),
                    "raw",
                    reactApplicationContext.packageName,
                )
            )
        else
            fromAsset(value.dropLast(1))
}
