@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")

package com.adapty.react

import android.view.View
import androidx.lifecycle.ViewModelStoreOwner
import com.adapty.internal.crossplatform.ui.Dependencies.safeInject
import com.adapty.internal.crossplatform.ui.OnboardingUiManager
import com.adapty.ui.onboardings.AdaptyOnboardingView
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter

class AdaptyOnboardingViewManager : SimpleViewManager<AdaptyOnboardingView>() {

    private val onboardingUiManager: OnboardingUiManager? by safeInject()

    override fun getName(): String = "AdaptyOnboardingView"

    override fun createViewInstance(reactContext: ThemedReactContext): AdaptyOnboardingView {
        return AdaptyOnboardingView(reactContext).apply {
            id = View.generateViewId()
        }
    }

    @ReactProp(name = "viewId")
    fun setViewId(view: AdaptyOnboardingView, id: String?) {
        view.tag = id
    }

    @ReactProp(name = "onboardingJson")
    fun setOnboardingJson(view: AdaptyOnboardingView, json: String?) {
        if (json.isNullOrEmpty()) return

        val viewId = view.tag as? String ?: "rn_native_view"
        val reactContext = view.context as? ThemedReactContext ?: return
        val vmOwner = reactContext.currentActivity as? ViewModelStoreOwner ?: return

        val onboardingUiManager = onboardingUiManager ?: return

        onboardingUiManager.setupOnboardingView(
            view,
            vmOwner,
            json,
            viewId,
            { eventViewId, eventId, eventData ->
                if (eventViewId != viewId) return@setupOnboardingView

                val event = Arguments.createMap().apply {
                    putString("eventId", eventId)
                    putString("eventData", eventData)
                }

                reactContext
                    .getJSModule(RCTEventEmitter::class.java)
                    .receiveEvent(view.id, "onEvent", event)
            }
        )
    }

    override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "onEvent" to mapOf(
                "phasedRegistrationNames" to mapOf("bubbled" to "onEvent")
            )
        )
    }
}
