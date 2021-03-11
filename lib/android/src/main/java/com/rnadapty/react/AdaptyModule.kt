package com.rnadapty.react

import android.annotation.SuppressLint
import android.app.Activity
import com.adapty.Adapty
import com.adapty.api.AttributionType
import com.adapty.api.entity.profile.update.Date
import com.adapty.api.entity.profile.update.Gender
import com.adapty.api.entity.profile.update.ProfileParameterBuilder
import com.adapty.api.entity.purchaserInfo.OnPurchaserInfoUpdatedListener
import com.adapty.api.entity.purchaserInfo.model.PurchaserInfoModel
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.gson.Gson
import java.text.SimpleDateFormat
import com.adapty.api.AdaptyError
import com.adapty.api.entity.paywalls.OnPromoReceivedListener
import com.adapty.api.entity.paywalls.PaywallModel
import com.adapty.api.entity.paywalls.ProductModel
import com.adapty.api.entity.paywalls.PromoModel
import com.adapty.utils.AdaptyLogLevel
import com.rnadapty.react.models.*

class AdaptyModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val gson = Gson()
    private val products = HashMap<String, ProductModel>()
    private val paywalls = ArrayList<PaywallModel>()

    override fun getName(): String {
        return "RNAdapty"
    }

    private fun sendEvent(reactContext: ReactContext,
                          eventName: String,
                          params: String) {
        reactContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
    }

    private fun subscribeToEvents() {
        Adapty.setOnPromoReceivedListener(object: OnPromoReceivedListener {
            override fun onPromoReceived(promo: PromoModel) {
                println("[EVENT] Received Promo")
                sendEvent(reactApplicationContext, "onPromoReceived", gson.toJson(AdaptyRNPromo.from(promo)))

            }
        })

        Adapty.setOnPurchaserInfoUpdatedListener(object: OnPurchaserInfoUpdatedListener {
            override fun onPurchaserInfoReceived(purchaserInfo: PurchaserInfoModel) {
                println("[EVENT] Received Purchaser info")
                sendEvent(reactApplicationContext, "onInfoUpdate", gson.toJson(purchaserInfo))
            }
        })
    }

    @ReactMethod
    fun logShowPaywall(variationId: String, promise: Promise) {
        val paywall = paywalls.firstOrNull { it.variationId == variationId }

        if (paywall == null) {
            throwUnknownError(promise, "Paywall with such variationID found")
            return@logShowPaywall
        }
       Adapty.logShowPaywall(paywall)
        promise.resolve(null)
    }

    @ReactMethod
    fun setExternalAnalyticsEnabled(isEnabled: Boolean, promise: Promise) {
        Adapty.setExternalAnalyticsEnabled(isEnabled) {
            if (it != null) {
                throwError(promise, it)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun setVariationID(variationId: String, transactionId: String, promise: Promise) {
        Adapty.setTransactionVariationId(transactionId, variationId) {
            if (it != null) {
                throwError(promise, it)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun activate(sdkKey: String, customerUserId: String?, observerMode: Boolean, logLevel: String, promise: Promise) {
        Adapty.activate(reactApplicationContext, sdkKey, customerUserId)

        when (logLevel) {
            "verbose" -> Adapty.setLogLevel(AdaptyLogLevel.VERBOSE)
            "error" -> Adapty.setLogLevel(AdaptyLogLevel.ERROR)
            else -> Adapty.setLogLevel(AdaptyLogLevel.NONE)
        }

        if (observerMode) {
//            Adapty.syncPurchases { }
        }

        subscribeToEvents()

        promise.resolve(null)
    }

    @ReactMethod
    fun logout(promise: Promise) {
        Adapty.logout { error ->
            if (error != null) {
                throwError(promise, error)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun identify(customerUserId: String, promise: Promise) {
        Adapty.identify(customerUserId) { error ->
            if (error != null) {
                throwError(promise, error)
            } else {
                promise.resolve(null)
            }
        }
    }

    @SuppressLint("SimpleDateFormat")
    @ReactMethod
    fun updateProfile(updates: ReadableMap, promise: Promise) {
        val params = ProfileParameterBuilder()
        val map = updates.toHashMap()

        if (map.containsKey("email")) {
            val email = map.getValue("email")
            params.withEmail(email.toString())
        }
        if (map.containsKey("email")) {
            val email = map.getValue("email")
            params.withEmail(email.toString())
        }
        if (map.containsKey("facebookAnonymousId")) {
            val anonymousId = map.getValue("facebookAnonymousId")
            params.withFacebookAnonymousId(anonymousId.toString())
        }
        if (map.containsKey("amplitudeDeviceId")) {
            val ampId = map.getValue("amplitudeDeviceId")
            params.withAmplitudeDeviceId(ampId.toString())
        }
        if (map.containsKey("amplitudeUserId")) {
            val ampId = map.getValue("amplitudeUserId")
            params.withAmplitudeUserId(ampId.toString())
        }
        if (map.containsKey("appmetricaDeviceId")) {
            val appId = map.getValue("appmetricaDeviceId")
            params.withAppmetricaDeviceId(appId.toString())
        }
        if (map.containsKey("appmetricaProfileId")) {
            val appId = map.getValue("appmetricaProfileId")
            params.withAppmetricaProfileId(appId.toString())
        }
        if (map.containsKey("birthday")) {
            val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
            val date = formatter.parse(map.getValue("birthday").toString())
            params.withBirthday(Date(date.year, date.month + 1, date.date))
        }
        if (map.containsKey("customAttributes")) {
            val attrs = map.getValue("customAttributes") as HashMap<String, Any>
            params.withCustomAttributes(attrs)
        }
        if (map.containsKey("facebookUserId")) {
            val fbId = map.getValue("facebookUserId")
            params.withFacebookUserId(fbId.toString())
        }
        if (map.containsKey("firstName")) {
            val name = map.getValue("firstName")
            params.withFirstName(name.toString())
        }
        if (map.containsKey("lastName")) {
            val name = map.getValue("lastName")
            params.withLastName(name.toString())
        }
        if (map.containsKey("gender")) {
            when (map.getValue("gender")) {
                "male" -> params.withGender(Gender.MALE)
                "female" -> params.withGender(Gender.FEMALE)
                else -> params.withGender(Gender.OTHER)
            }
        }
        if (map.containsKey("mixpanelUserId")) {
            val mUId = map.getValue("mixpanelUserId")
            params.withMixpanelUserId(mUId.toString())
        }
        if (map.containsKey("phoneNumber")) {
            val phone = map.getValue("phoneNumber")
            params.withPhoneNumber(phone.toString())
        }

        Adapty.updateProfile(params) { error ->
            if (error != null) {
                throwError(promise, error)
                return@updateProfile
            }

            promise.resolve(null)
        }
    }

    @ReactMethod
    fun getPaywalls(options: ReadableMap,promise: Promise) {
        val forceUpate = unwrapForceUpdate(options)

        Adapty.getPaywalls(forceUpate) { paywalls, products, error ->
            if (error != null) {
                throwError(promise, error)
                return@getPaywalls
            }

            cachePaywalls(paywalls)
            cacheProducts(products)
            val json = gson.toJson(GetPaywallsResult(paywalls.map(AdaptyRNPaywall::from), products.map(AdaptyRNProduct::from)))
            promise.resolve(json)
        }
    }

    @ReactMethod
    fun makePurchase(productId: String, variationId: String?, promise: Promise) {
        val product = variationId?.let { variationId ->
            paywalls.firstOrNull { it.variationId == variationId }?.products?.firstOrNull { it.vendorProductId == productId }
        } ?: products[productId]

        if (product == null) {
            throwUnknownError(promise,"Product with such vendorID was not found.")
            return@makePurchase
        }

        currentActivity.let {
            if (it is Activity) {
                Adapty.makePurchase(it, product) { info, token, result, product, error ->
                    if (error != null) {
                        throwError(promise, error)
                        return@makePurchase
                    }

                    val json = gson.toJson(MakePurchaseResult(info, token,result, AdaptyRNProduct.from(product)))
                    promise.resolve(json)
                }
            }
        }
    }

    @ReactMethod
    fun restorePurchases(promise: Promise) {
        Adapty.restorePurchases { purchaserInfo, list , error ->
            if (error != null) {
                throwError(promise, error)
                return@restorePurchases
            }

            val json = gson.toJson(RestoreResult(purchaserInfo, list))
            promise.resolve(json)
        }
    }

    @ReactMethod
    fun getPromo(promise: Promise) {
        Adapty.getPromo { promo, error ->
            if (error != null) {
                throwError(promise, error)
                return@getPromo
            }

            if (promo == null) {
                promise.resolve(null)
            } else {
                val json = gson.toJson(AdaptyRNPromo.from(promo))
                promise.resolve(json)
            }
        }
    }

    @ReactMethod
    fun getPurchaseInfo(options: ReadableMap, promise: Promise) {
        val forceUpdate = unwrapForceUpdate(options)

        Adapty.getPurchaserInfo(forceUpdate) { purchaserInfo, error ->
            if (error != null) {
                throwError(promise, error)
                return@getPurchaserInfo
            }

            val json = gson.toJson(purchaserInfo)
            promise.resolve(json)
        }
    }

    @ReactMethod
    fun updateAttribution(map: ReadableMap, source: String, promise: Promise) {
        val sourceType: AttributionType? = when (source) {
            "Branch" -> AttributionType.BRANCH
            "Adjust" -> AttributionType.ADJUST
            "AppsFlyer" -> AttributionType.APPSFLYER
            else -> null
        }

        if (sourceType == null) {
            throwUnknownError(promise,"Source of attribution is not defined")
            return
        }

        Adapty.updateAttribution(map.toHashMap(), sourceType) {}
        promise.resolve(null)
    }


    private fun unwrapForceUpdate(options: ReadableMap?): Boolean {
        if (options == null || !options.hasKey("forceUpdate")) {
            return false
        }
        return options.getBoolean("forceUpdate")
    }
    private fun cachePaywalls(paywalls: List<PaywallModel>) = this.paywalls.run {
        clear()
        addAll(paywalls)
    }
    private fun cacheProducts(products: List<ProductModel>) = this.products.run {
        clear()
        products.forEach { product ->
            product.vendorProductId?.let { id ->
                put(id, product)
            }
        }
    }
    private fun throwError(promise: Promise, error: AdaptyError) =
            promise.reject("adapty_error", gson.toJson(AdaptyRNError.from(error)))

    private fun throwUnknownError(promise: Promise, message: String) =
            promise.reject("adapty_error", gson.toJson(AdaptyRNError.from(message)))
}
