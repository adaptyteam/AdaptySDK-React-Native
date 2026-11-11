package com.adapty.react

import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.utils.FileLocation
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyReactModule(reactContext: ReactApplicationContext) :
    AdaptyReactModuleSpec(reactContext) {
    companion object {
        const val NAME = "RNAdapty"
    }

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
            // isPresentationEmbedded: present flows and onboardings as dialog fragments in the host
            // activity, so a singleTask MainActivity reopened from the launcher does not clear them
            true,
        )
        crossplatformHelper.setActivity { reactApplicationContext.currentActivity }

    }

    override fun getName(): String = NAME

    @ReactMethod
    override fun addListener(eventName: String) {
        listenerCount += 1
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        listenerCount -= 1

        if (listenerCount == 0) {
            Adapty.setOnProfileUpdatedListener(null)
        }
    }

    @ReactMethod
    override fun handle(method: String, args: ReadableMap, promise: Promise) {
        crossplatformHelper.onMethodCall(args.getString("args").orEmpty(), method) { data ->
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
