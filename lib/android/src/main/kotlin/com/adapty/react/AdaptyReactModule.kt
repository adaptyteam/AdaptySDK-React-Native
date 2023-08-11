package com.adapty.react

import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.internal.crossplatform.CrossplatformName
import com.adapty.internal.crossplatform.MetaInfo
import com.adapty.react.BuildConfig.VERSION_NAME
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

@Suppress("SpellCheckingInspection")
class AdaptyReactModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var listenerCount = 0
    private val ctx = reactContext
    private val callHandler = AdaptyCallHandler(reactContext)

    override fun initialize() {
        super.initialize()

        val info = MetaInfo.from(
            CrossplatformName.REACT_NATIVE,
            VERSION_NAME
        )

        CrossplatformHelper.init(info)
    }

    override fun getName(): String {
        return "RNAdapty"
    }

    private inline fun <reified T : Any> sendEvent(
        reactContext: ReactContext,
        eventName: EventName,
        params: T
    ) {
        if (listenerCount == 0) {
            return
        }

        val result = AdaptyBridgeResult(
            data = params,
            T::class.simpleName ?: "Any",
        )

        val receiver = reactContext.getJSModule(
            DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
        )

        receiver.emit(
            eventName.value,
            result.let(CrossplatformHelper.shared::toJson)
        )
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        if (listenerCount == 0) {
            Adapty.setOnProfileUpdatedListener { profile ->
                sendEvent(
                    ctx,
                    EventName.ON_LATEST_PROFILE_LOAD,
                    profile,
                )
            }
        }

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
        val ctx = AdaptyContext(
            methodName,
            args,
            promise,
            currentActivity
        )

        callHandler.handle(ctx)
    }
}
