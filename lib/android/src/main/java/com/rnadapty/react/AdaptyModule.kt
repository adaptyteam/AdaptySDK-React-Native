package com.rnadapty.react

import android.app.Activity
import android.util.Log
import com.adapty.Adapty
import com.adapty.errors.AdaptyError
import com.adapty.listeners.OnPromoReceivedListener
import com.adapty.listeners.OnPurchaserInfoUpdatedListener
import com.adapty.models.*
import com.adapty.models.SubscriptionUpdateParamModel.ProrationMode
import com.adapty.utils.AdaptyLogLevel
import com.adapty.utils.ProfileParameterBuilder
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.google.gson.Gson
import com.rnadapty.react.models.*


class AdaptyModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val gson = Gson()
    private val products = HashMap<String, ProductModel>()
    private val paywalls = ArrayList<PaywallModel>()

    private val promoPaywalls = ArrayList<PaywallModel>()
    private val promoProducts = HashMap<String, ProductModel>()

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

    @ReactMethod
    fun addListener(eventName: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    private fun subscribeToEvents() {
        Adapty.setOnPromoReceivedListener(object: OnPromoReceivedListener {
            override fun onPromoReceived(promo: PromoModel) {
                println("[EVENT] Received Promo")
                sendEvent(reactApplicationContext, "onPromoReceived", gson.toJson(AdaptyPromo(promo)))

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
    fun setFallbackPaywalls(paywalls: String, promise: Promise) {
        Adapty.setFallbackPaywalls(paywalls) {
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
        UiThreadUtil.runOnUiThread {
            Adapty.activate(reactApplicationContext, sdkKey, customerUserId)

            when (logLevel) {
                "verbose" -> Adapty.setLogLevel(AdaptyLogLevel.VERBOSE)
                "error" -> Adapty.setLogLevel(AdaptyLogLevel.ERROR)
                "all" -> Adapty.setLogLevel(AdaptyLogLevel.ALL)
                else -> Adapty.setLogLevel(AdaptyLogLevel.NONE)
            }

            subscribeToEvents()
            promise.resolve(null)
        }
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

    @ReactMethod
    fun updateProfile(updates: ReadableMap, promise: Promise) {
        val params = ProfileParameterBuilder()
        val map = updates.toHashMap()

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
        // if (map.containsKey("birthday")) {
        //     val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
        //     val date = LocalDate.parse(map.getValue("birthday").toString(), formatter)
        //     params.withBirthday(Date(date.year, date.monthValue, date.dayOfMonth))
        // }
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

            var paywallsAdapty = ArrayList<AdaptyPaywall>(0);
            var productsAdapty = ArrayList<AdaptyProduct>(0);

            if (paywalls != null) {
                cachePaywalls(paywalls)
                paywallsAdapty = ArrayList(paywalls.map { AdaptyPaywall(it) })
            }
            if (products != null) {
                cacheProducts(products)
                productsAdapty = ArrayList(products.map { AdaptyProduct(it) })
            }

            val result = GetPaywallsResult(
                paywallsAdapty,
                productsAdapty
            )
            val json = gson.toJson(result)
            promise.resolve(json)
        }
    }

    @ReactMethod
    fun makePurchase(productId: String, variationId: String?, subParams: ReadableMap?, promise: Promise) {
        var product = variationId?.let { variationId ->
            paywalls.firstOrNull { it.variationId == variationId }?.products?.firstOrNull { it.vendorProductId == productId }
        } ?: products[productId]

        if (product == null) {
           product = variationId?.let {
                promoPaywalls.firstOrNull { it.variationId == variationId}?.products?.firstOrNull { it.vendorProductId== productId}
            } ?: promoProducts[productId]
        }

        if (product == null) {
            throwUnknownError(promise,"Product with such vendorID was not found.")
            return@makePurchase
        }

        currentActivity.let {
            if (it is Activity) {
                var subsUpdate: SubscriptionUpdateParamModel? = null
                if (subParams != null) {
                    var oldSubVendorProductId: String? = null

                    if (subParams.hasKey("oldSubVendorProductId")) {
                        oldSubVendorProductId = subParams.getString("oldSubVendorProductId")
                    }
                    if (subParams.hasKey("prorationMode")) {
                        val prorationMode = when (subParams.getString("prorationMode")) {
                            "immediate_with_time_proration" -> ProrationMode.IMMEDIATE_WITH_TIME_PRORATION
                            "immediate_and_charge_prorated_price" -> ProrationMode.IMMEDIATE_AND_CHARGE_PRORATED_PRICE
                            "immediate_without_proration" -> ProrationMode.IMMEDIATE_WITHOUT_PRORATION
                            "deferred" -> ProrationMode.DEFERRED
                            "immediate_and_charge_full_price" -> ProrationMode.IMMEDIATE_AND_CHARGE_PRORATED_PRICE
                            else -> null
                        }

                        if (prorationMode != null && oldSubVendorProductId != null) {
                            subsUpdate = SubscriptionUpdateParamModel(oldSubVendorProductId, prorationMode)
                        }
                    }
                }

                Adapty.makePurchase(it, product, subsUpdate) { info, token, result, product, error ->
                    if (error != null) {
                        throwError(promise, error)
                        return@makePurchase
                    }

                    val json = gson.toJson(MakePurchaseResult(info, token,result, AdaptyProduct(product)))
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
                return@getPromo
            }

            val paywall = promo.paywall
            if (paywall != null) {
                cachePromoPaywall(paywall)
                cachePromoProducts(paywall.products)
            }

            val json = gson.toJson(AdaptyPromo(promo))
            promise.resolve(json)
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
            Log.d("Purchaser info JSON", json)
            println(purchaserInfo)
            promise.resolve(json)
        }
    }

    @ReactMethod
    fun updateAttribution(map: ReadableMap, source: String, networkUserId: String, promise: Promise) {
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

        Adapty.updateAttribution(map.toHashMap(), sourceType, networkUserId) {
            if (it != null) {
                throwError(promise, it)
            } else {
                promise.resolve(null)
            }
        }
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
        products.forEach { product -> put(product.vendorProductId, product) }
    }
    private fun cachePromoPaywall(paywall: PaywallModel) = this.promoPaywalls.run {
        clear()
        add(paywall)
    }
    private fun cachePromoProducts(productList: List<ProductModel>) = this.promoProducts.run {
        clear()
        productList.forEach { product -> put(product.vendorProductId, product) }
    }
    private fun throwError(promise: Promise, error: AdaptyError) =
            promise.reject("adapty_error", gson.toJson(AdaptyRNError.from(error)))

    private fun throwUnknownError(promise: Promise, message: String) =
            promise.reject("adapty_error", gson.toJson(AdaptyRNError.from(message)))
}
