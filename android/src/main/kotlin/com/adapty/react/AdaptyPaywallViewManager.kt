@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")
@file:OptIn(InternalAdaptyApi::class)

package com.adapty.react

import android.view.View
import androidx.lifecycle.ViewModelStoreOwner
import com.adapty.internal.crossplatform.ui.Dependencies.safeInject
import com.adapty.internal.crossplatform.ui.PaywallUiManager
import com.adapty.ui.AdaptyPaywallView
import com.adapty.internal.utils.InternalAdaptyApi
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyPaywallViewManager : SimpleViewManager<AdaptyPaywallView>() {

    companion object {
        private const val TAG_KEY_PAYWALL_JSON = 0xAD0B200
        private const val TAG_KEY_SETUP_SCHEDULED = 0xAD0B201
    }

    private val paywallUiManager: PaywallUiManager? by safeInject<PaywallUiManager>()

    override fun getName(): String = "AdaptyPaywallView"

    override fun createViewInstance(reactContext: ThemedReactContext): AdaptyPaywallView {
        return AdaptyPaywallView(reactContext).apply {
            id = View.generateViewId()
        }
    }

    override fun onDropViewInstance(view: AdaptyPaywallView) {
        // Clear internal state/listeners to prevent leaks
        paywallUiManager?.clearPaywallView(view)
        super.onDropViewInstance(view)
    }

    @ReactProp(name = "viewId")
    fun setViewId(view: AdaptyPaywallView, id: String?) {
        view.tag = id
        scheduleSetup(view)
    }

    @ReactProp(name = "paywallJson")
    fun setPaywallJson(view: AdaptyPaywallView, json: String?) {
        if (json.isNullOrEmpty()) return
        view.setTag(TAG_KEY_PAYWALL_JSON, json)
        scheduleSetup(view)
    }

    private fun scheduleSetup(view: AdaptyPaywallView) {
        val scheduled = (view.getTag(TAG_KEY_SETUP_SCHEDULED) as? Boolean) == true
        if (scheduled) return
        view.setTag(TAG_KEY_SETUP_SCHEDULED, true)
        view.post {
            view.setTag(TAG_KEY_SETUP_SCHEDULED, false)
            setupView(view)
        }
    }

    private fun setupView(view: AdaptyPaywallView) {
        val json = view.getTag(TAG_KEY_PAYWALL_JSON) as? String ?: return
        val viewId = view.tag as? String ?: return
        val reactContext = view.context as? ThemedReactContext ?: return
        val vmOwner = reactContext.currentActivity as? ViewModelStoreOwner ?: return

        val paywallUiManager = paywallUiManager ?: return

        // Force re-create internal content to reflect latest props
        // Don't work as expected. It breaks UI
        // view.removeAllViews()

        paywallUiManager.setupPaywallView(
            view,
            vmOwner,
            json,
            viewId,
            { eventViewId, eventId, eventData ->
                if (eventViewId != viewId) return@setupPaywallView

                val receiver = reactContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                )

                receiver.emit(eventId, eventData)
            }
        )
    }
}


