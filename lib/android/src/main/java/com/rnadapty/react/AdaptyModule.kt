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
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import com.adapty.api.ApiClient
import android.util.Log
import com.adapty.api.entity.DataState
import com.adapty.api.entity.paywalls.OnPromoReceivedListener
import com.adapty.api.entity.paywalls.PromoModel
import com.adapty.api.entity.validate.GoogleValidationResult
import com.adapty.purchase.PurchaseType
import com.adapty.utils.AdaptyLogLevel

class AdaptyModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    val gson = Gson()

    override fun getName(): String {
        return "RNAdapty"
    }

    fun shouldDrop(options: ReadableMap, state: DataState): Boolean {
        return when (options.getBoolean("cached")) {
            true -> state == DataState.SYNCED
            else -> state == DataState.CACHED
        }
    }

    private fun sendEvent(reactContext: ReactContext,
                          eventName: String,
                          params: Any) {
        reactContext
                .getJSModule(RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
    }

    private fun subscribeToEvents() {
        Adapty.setOnPromoReceivedListener(object: OnPromoReceivedListener {
            override fun onPromoReceived(promo: PromoModel) {
                println("[EVENT] Received Promo")
                val data = promo.serializeToMap()
            }
        })


        Adapty.setOnPurchaserInfoUpdatedListener(object: OnPurchaserInfoUpdatedListener {
            override fun onPurchaserInfoReceived(purchaserInfo: PurchaserInfoModel) {
                println("[EVENT] Received Purchaser info")
                val data = purchaserInfo.serializeToMap()
                sendEvent(reactApplicationContext, "onCheck", toWritableMap(data))
            }
        })
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
            Adapty.syncPurchases { }
        }

        subscribeToEvents()

        promise.resolve(true)
    }

    @ReactMethod
    fun logout(promise: Promise) {
        Adapty.logout { error ->
            if (error != null) {
                promise.reject("Error in: logout", error)
                return@logout;
            }
            promise.resolve(true)
            return@logout;
        }
    }

    @ReactMethod
    fun identify(customerUserId: String, promise: Promise) {
        Adapty.identify(customerUserId) { error ->
            if (error != null) {
                promise.reject("Error in: identify", error)
                return@identify
            }
            promise.resolve(true)
            return@identify
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
                promise.reject("Error in: updateProfile", error)
                return@updateProfile
            }

            promise.resolve(true)
        }
    }



    @ReactMethod
    fun getPaywalls(options: ReadableMap,promise: Promise) {
        Adapty.getPaywalls { paywalls, products, state, error ->
           if (shouldDrop(options, state)) {
               return@getPaywalls
           }

            if (error != null) {
                promise.reject("Error in: getPaywalls", error)
                return@getPaywalls
            }

            val hm: HashMap<String, String> = HashMap()
            hm["products"] = gson.toJson(products)
            hm["paywalls"] = gson.toJson(paywalls)
            promise.resolve(toWritableMap(hm))
        }
    }

    @ReactMethod
    fun makePurchase(productId: String, options: ReadableMap, promise: Promise) {
        Adapty.getPaywalls { _, products, state, error ->
            if (shouldDrop(options, state)) {
                return@getPaywalls
            }

            if (error != null) {
                promise.reject("Error, while getting list of products [1]", error)
                return@getPaywalls
            }

            val product = products.find { it.vendorProductId == productId }

            if (product == null) {
                promise.reject("Error while getting the product", "Product with such vendorID was not found.")
                return@getPaywalls
            }

            currentActivity.let {
                if (it is Activity) {
                    Adapty.makePurchase(it, product) { purchaserInfo, token, googleValidationResult, product ,error ->
                        if (error != null) {
                            promise.reject("Error in makePurchase", error)
                            return@makePurchase
                        }

                        val hm: HashMap<String, String> = HashMap()
                        hm["purchaserInfo"] = gson.toJson(purchaserInfo)
                        hm["product"] = gson.toJson(product.serializeToMap())
                        if (token != null) {
                            hm["receipt"] = token
                        }

                        val map = toWritableMap(hm)
                        promise.resolve(map)
                    }
                }
            }
            return@getPaywalls
        }
    }

    @ReactMethod
    fun restorePurchases(promise: Promise) {
        Adapty.restorePurchases { purchaserInfo, list , error ->
            if (error != null) {
                promise.reject("Error in: restorePurchases", error)
                return@restorePurchases
            }

            val receipts = list?.mapNotNull { it.purchaseToken }

            val hm: HashMap<String, String> = HashMap()
            hm["purchaserInfo"] = gson.toJson(purchaserInfo)

            if (receipts != null && receipts.isNotEmpty()) {
                hm["receipt"] = receipts.last()
            }

            val map = toWritableMap(hm)
            promise.resolve(map)
        }
    }

    @ReactMethod
    fun validateReceipt(productId: String, receipt: String, promise: Promise) {
        Adapty.getPaywalls { _, products, state, error ->
            if (state == DataState.SYNCED) {
                return@getPaywalls
            }

            if (error != null) {
                promise.reject("Error, while getting list of products [1]", error)
                return@getPaywalls
            }

            val product = products.find { it.vendorProductId == productId }

            if (product?.skuDetails == null) {
                promise.reject("Error while getting the product", "Product with such vendorID was not found.")
                return@getPaywalls
            }

            val type: PurchaseType? = when (product.skuDetails?.type) {
                "subs" -> PurchaseType.SUBS
                "inapp" -> PurchaseType.INAPP
                else -> null
            }
            if (type == null) {
                promise.reject("Error in: validateReceipt", "Error while extracting product type")
                return@getPaywalls
            }

            Adapty.validatePurchase(type, productId, receipt) { purchaserInfo ,_, _, error ->
                if (error != null) {
                    promise.reject("Error in: validateReceipt", error)
                    return@validatePurchase
                }

                val hm: HashMap<String, Any> = HashMap()
                hm["purchaserInfo"] = gson.toJson(purchaserInfo)
                val map = toWritableMap(hm)
                promise.resolve(map)
            }
        }
    }

    @ReactMethod
    fun getPromo(promise: Promise) {
        Adapty.getPromo { promo, error ->
            if (error != null) {
                promise.reject("Error in: getPromo", error)
                return@getPromo
            }

            if (promo != null) {
                val promoMap = promo.serializeToMap()
                val data = toWritableMap(promoMap)
                promise.resolve(data)
            }

            promise.resolve(null)
        }
    }

    @ReactMethod
    fun getPurchaseInfo(options: ReadableMap, promise: Promise) {
        Adapty.getPurchaserInfo { purchaserInfo, state, error ->
            if (shouldDrop(options, state)) {
                return@getPurchaserInfo
            }

            if (error != null) {
                promise.reject("Error in: getPurchaserInfo", error)
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
            promise.reject("Error in: updateAttribution", "Source of attribution is not defined")
            return
        }

        Adapty.updateAttribution(map, sourceType) {}
        promise.resolve(true)
    }

    private fun toWritableArray(array: Array<Any?>): WritableArray {
        val writableArray: WritableArray = WritableNativeArray()

        for (element in array) {
            when (element) {
                is String -> writableArray.pushString(element)
                is Int -> writableArray.pushInt(element)
                is Double -> writableArray.pushDouble(element)
                is Boolean -> writableArray.pushBoolean(element)
                is Map<*, *> -> writableArray.pushMap(toWritableMap(element.serializeToMap()))
                is Array<*> -> writableArray.pushArray(toWritableArray(element as Array<Any?>))
                is List<*> -> writableArray.pushArray(toWritableArray(element.toTypedArray()))
                null -> writableArray.pushNull()
            }
        }
        return writableArray
    }

    private fun toWritableMap(map: Map<String, *>): WritableMap {
        val writableMap: WritableMap = WritableNativeMap()

        for ((key, value) in map) {
            when (value) {
                is String -> writableMap.putString(key, value)
                is Int -> writableMap.putInt(key, value)
                is Double -> writableMap.putDouble(key, value)
                is Boolean -> writableMap.putBoolean(key, value)
                is Map<*, *> -> writableMap.putMap(key, toWritableMap(value.serializeToMap()))
                is Array<*> -> writableMap.putArray(key, toWritableArray(value as Array<Any?>))
                is List<*> -> writableMap.putArray(key, toWritableArray(value.toTypedArray()))
                null -> writableMap.putNull(key)
            }
        }
        return writableMap
    }

    //convert an object of type I to type O
    inline fun <I, reified O> I.convert(): O {
        val json = gson.toJson(this)
        return gson.fromJson(json, object : TypeToken<O>() {}.type)
    }

    //convert a data class to a map
    fun <T> T.serializeToMap(): Map<String, Any> {
        return convert()
    }
}
