@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")

package com.adapty.react

import android.view.View
import androidx.lifecycle.ViewModelStoreOwner
import com.adapty.internal.crossplatform.ui.Dependencies.safeInject
import com.adapty.internal.crossplatform.ui.FlowUiManager
import com.adapty.internal.crossplatform.ui.FlowView
import com.adapty.internal.utils.InternalAdaptyApi
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.modules.core.DeviceEventManagerModule

class AdaptyFlowViewManager : SimpleViewManager<FlowView>() {

    companion object {
        private const val TAG_KEY_VIEW_ID = 0xAD0B200
        private const val TAG_KEY_FLOW_JSON = 0xAD0B201
        private const val TAG_KEY_SETUP_SCHEDULED = 0xAD0B202
    }

    private val flowUiManager: FlowUiManager? by safeInject<FlowUiManager>()

    override fun getName(): String = "AdaptyFlowView"

    override fun createViewInstance(reactContext: ThemedReactContext): FlowView {
        return FlowView(reactContext).apply {
            id = View.generateViewId()
        }
    }

    override fun onDropViewInstance(view: FlowView) {
        // Clear internal state/listeners to prevent leaks
        flowUiManager?.clearFlowView(view)
        super.onDropViewInstance(view)
    }

    @ReactProp(name = "viewId")
    fun setViewId(view: FlowView, id: String?) {
        view.setTag(TAG_KEY_VIEW_ID, id)
        scheduleSetup(view)
    }

    @ReactProp(name = "flowJson")
    fun setFlowJson(view: FlowView, json: String?) {
        if (json.isNullOrEmpty()) return
        view.setTag(TAG_KEY_FLOW_JSON, json)
        scheduleSetup(view)
    }

    private fun scheduleSetup(view: FlowView) {
        val scheduled = (view.getTag(TAG_KEY_SETUP_SCHEDULED) as? Boolean) == true
        if (scheduled) return
        view.setTag(TAG_KEY_SETUP_SCHEDULED, true)
        view.post {
            view.setTag(TAG_KEY_SETUP_SCHEDULED, false)
            setupView(view)
        }
    }

    private fun setupView(view: FlowView) {
        val json = view.getTag(TAG_KEY_FLOW_JSON) as? String ?: return
        val viewId = view.getTag(TAG_KEY_VIEW_ID) as? String ?: return
        val reactContext = view.context as? ThemedReactContext ?: return
        val vmOwner = reactContext.currentActivity as? ViewModelStoreOwner ?: return

        val flowUiManager = flowUiManager ?: return

        flowUiManager.setupFlowView(
            view,
            vmOwner,
            json,
            viewId,
            { eventViewId, eventId, eventData ->
                if (eventViewId != viewId) return@setupFlowView

                val receiver = reactContext.getJSModule(
                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                )

                receiver.emit(eventId, eventData)
            }
        )
    }
}
