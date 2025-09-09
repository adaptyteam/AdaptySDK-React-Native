@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")

package com.adapty.react

import android.view.View
import androidx.lifecycle.ViewModelStoreOwner
import com.adapty.internal.crossplatform.ui.Dependencies.safeInject
import com.adapty.internal.crossplatform.ui.OnboardingUiManager
import com.adapty.ui.onboardings.AdaptyOnboardingView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyOnboardingViewManager : SimpleViewManager<AdaptyOnboardingView>() {

    companion object {
        private const val TAG_KEY_ONBOARDING_JSON = 0xAD0B100
        private const val TAG_KEY_SETUP_SCHEDULED = 0xAD0B101
    }

    private val onboardingUiManager: OnboardingUiManager? by safeInject<OnboardingUiManager>()

    override fun getName(): String = "AdaptyOnboardingView"

    override fun createViewInstance(reactContext: ThemedReactContext): AdaptyOnboardingView {
        return AdaptyOnboardingView(reactContext).apply {
            id = View.generateViewId()
        }
    }

    @ReactProp(name = "viewId")
    fun setViewId(view: AdaptyOnboardingView, id: String?) {
        view.tag = id
        scheduleSetup(view)
    }

    @ReactProp(name = "onboardingJson")
    fun setOnboardingJson(view: AdaptyOnboardingView, json: String?) {
        if (json.isNullOrEmpty()) return
        view.setTag(TAG_KEY_ONBOARDING_JSON, json)
        scheduleSetup(view)
    }

    private fun scheduleSetup(view: AdaptyOnboardingView) {
        val scheduled = (view.getTag(TAG_KEY_SETUP_SCHEDULED) as? Boolean) == true
        if (scheduled) return
        view.setTag(TAG_KEY_SETUP_SCHEDULED, true)
        view.post {
            view.setTag(TAG_KEY_SETUP_SCHEDULED, false)
            setupView(view)
        }
    }

    private fun setupView(view: AdaptyOnboardingView) {
        val json = view.getTag(TAG_KEY_ONBOARDING_JSON) as? String ?: return
        val viewId = view.tag as? String ?: return
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

                val receiver = reactContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                )

                receiver.emit(eventId, eventData)
            }
        )
    }
}
