package com.adapty.react

import android.app.Activity
import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.models.*
import com.adapty.utils.AdaptyLogLevel
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.modules.core.DeviceEventManagerModule

internal class AdaptyCallHandler(
    private val helper: CrossplatformHelper,
    private val reactApplicationContext: ReactApplicationContext
    ) {

    fun handle(methodName: String, args: ReadableMap, promise: Promise, activity: Activity?) {
        val ctx = AdaptyContext(methodName, args, promise, helper, activity)

        when (ctx.method) {
            ACTIVATE -> handleActivate(ctx)
            GET_PAYWALL -> handleGetPaywall(ctx)
            GET_PAYWALL_PRODUCTS -> handleGetPaywallProducts(ctx)
            GET_PROFILE -> handleGetProfile(ctx)
            IDENTIFY -> handleIdentify(ctx)
            LOGOUT -> handleLogout(ctx)
            LOG_SHOW_ONBOARDING -> handleLogShowOnboarding(ctx)
            LOG_SHOW_PAYWALL -> handleLogShowPaywall(ctx)
            MAKE_PURCHASE -> handleMakePurchase(ctx)
            RESTORE_PURCHASES -> handleRestorePurchases(ctx)
            SET_FALLBACK_PAYWALLS -> handleSetFallbackPaywalls(ctx)
            SET_LOG_LEVEL -> handleSetLogLevel(ctx)
            SET_VARIATION_ID -> handleSetVariationId(ctx)
            UPDATE_ATTRIBUTION -> handleUpdateAttribution(ctx)
            UPDATE_PROFILE -> handleUpdateProfile(ctx)
            else -> ctx.notImplemented()
        }
    }

    private fun handleActivate(ctx: AdaptyContext) {
        val sdkKey = ctx.args.getString(SDK_KEY) ?: kotlin.run {
            return ctx.argNotFound(SDK_KEY)
        }
        val customerUserId = ctx.args.getString(USER_ID)
        val observerMode = ctx.args.getBoolean(OBSERVER_MODE)
        val logLevel = ctx.args.getString(LOG_LEVEL)

        UiThreadUtil.runOnUiThread {
            Adapty.activate(
                reactApplicationContext,
                sdkKey,
                observerMode,
                customerUserId
            )

            when (logLevel) {
                "verbose" -> Adapty.logLevel = AdaptyLogLevel.VERBOSE
                "error" ->  Adapty.logLevel = AdaptyLogLevel.ERROR
                "info" ->  Adapty.logLevel = AdaptyLogLevel.INFO
                "warn" ->  Adapty.logLevel = AdaptyLogLevel.WARN
            }

            subscribeToEvents()
            ctx.success(null)
        }
    }

    private fun handleGetPaywall(ctx: AdaptyContext) {
        val id = ctx.args.getString(ID) ?: kotlin.run {
               return ctx.argNotFound(ID)
        }
        var locale: String? = null
        if (ctx.args.hasKey(LOCALE)) {
            locale = ctx.args.getString(LOCALE)
        }

        Adapty.getPaywall(id, locale) { adaptyResult -> ctx.resolve(adaptyResult) }
    }

    private fun handleGetPaywallProducts(ctx: AdaptyContext) {
        val paywall = ctx.parseJsonArgument<AdaptyPaywall>(PAYWALL) ?: kotlin.run {
            return ctx.argNotFound(PAYWALL)
        }

        Adapty.getPaywallProducts(paywall) { adaptyResult -> ctx.resolve(adaptyResult) }
    }

    private fun handleGetProfile(ctx: AdaptyContext) {
        Adapty.getProfile { adaptyResult -> ctx.resolve(adaptyResult) }
    }

    private fun handleIdentify(ctx: AdaptyContext) {
        val customerUserId = ctx.args.getString(USER_ID) ?: kotlin.run {
            return ctx.argNotFound(USER_ID)
        }

        Adapty.identify(customerUserId) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }

    private fun handleLogout(ctx: AdaptyContext) {
        Adapty.logout { maybeErr -> ctx.emptyOrError(maybeErr) }
    }

    private fun handleLogShowOnboarding(ctx: AdaptyContext) {
        val onboardingParams = ctx.parseJsonArgument<HashMap<*, *>>(ONBOARDING_PARAMS) ?: kotlin.run {
            return ctx.argNotFound(ONBOARDING_PARAMS)
        }

        val screenOrder = (onboardingParams["onboarding_screen_order"] as? Number)?.toInt() ?: kotlin.run {
            return ctx.argNotFound(ONBOARDING_PARAMS)
        }

        Adapty.logShowOnboarding(
            onboardingParams["onboarding_name"] as? String,
            onboardingParams["onboarding_screen_name"] as? String,
            screenOrder,
        ) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }


    private fun handleLogShowPaywall(ctx: AdaptyContext) {
        val paywall = ctx.parseJsonArgument<AdaptyPaywall>(PAYWALL) ?: kotlin.run {
            return ctx.argNotFound(PAYWALL)
        }

        Adapty.logShowPaywall(paywall) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }

    private fun handleMakePurchase(ctx: AdaptyContext) {
        val product = ctx.parseJsonArgument<AdaptyPaywallProduct>(PRODUCT) ?: kotlin.run {
            return ctx.argNotFound(PRODUCT)
        }

        val subscriptionUpdateParams =
            ctx.parseJsonArgument<AdaptySubscriptionUpdateParameters>(PARAMS)

        ctx.activity?.let {
            Adapty.makePurchase(
                it,
                product,
                subscriptionUpdateParams,
            ) { adaptyResult -> ctx.resolve(adaptyResult) }
        }
    }

    private fun handleRestorePurchases(ctx: AdaptyContext) {
        Adapty.restorePurchases { adaptyResult -> ctx.resolve(adaptyResult) }
    }

    private fun handleSetFallbackPaywalls(ctx: AdaptyContext) {
        val fallbackPaywalls = ctx.args.getString(PAYWALLS) ?: kotlin.run {
            return ctx.argNotFound(PAYWALLS)
        }

        Adapty.setFallbackPaywalls(fallbackPaywalls) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }


    private fun handleSetLogLevel(ctx: AdaptyContext) {
        val logLevel = try { helper.toLogLevel(ctx.args.getString(LOG_LEVEL)) } catch (e: Exception) { null }

        if (logLevel != null) {
            Adapty.logLevel = logLevel
            ctx.success(null)
        } else {
            ctx.argNotFound(LOG_LEVEL)
        }
    }

    private fun handleSetVariationId(ctx: AdaptyContext) {
        val transactionId = ctx.args.getString(TRANSACTION_ID)?.takeIf(String::isNotBlank) ?: kotlin.run {
            return ctx.argNotFound(TRANSACTION_ID)
        }
        val variationId = ctx.args.getString(VARIATION_ID)?.takeIf(String::isNotBlank) ?: kotlin.run {
            return ctx.argNotFound(VARIATION_ID)
        }

        Adapty.setVariationId(transactionId, variationId) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }

    private fun handleUpdateAttribution(ctx: AdaptyContext) {
        val attribution = (try {
            ctx.parseJsonArgument<Map<String, String>>(ATTRIBUTION)
        } catch (e: Exception) { null }) ?: kotlin.run {
            return ctx.argNotFound(ATTRIBUTION)
        }

        val source = helper.toAttributionSourceType(ctx.args.getString(SOURCE)) ?: kotlin.run {
            return ctx.argNotFound(ATTRIBUTION)
        }

        val userId = ctx.args.getString(NETWORK_USER_ID)

        Adapty.updateAttribution(attribution, source, userId) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }

    private fun handleUpdateProfile(ctx: AdaptyContext) {
        val profileParams = ctx.parseJsonArgument<AdaptyProfileParameters>(PARAMS) ?: kotlin.run {
            return ctx.argNotFound(PARAMS)
        }

        Adapty.updateProfile(profileParams) { maybeErr -> ctx.emptyOrError(maybeErr) }
    }


    private fun sendEvent(reactContext: ReactContext,
        eventName: String,
        params: String
    ) {
        reactContext.getJSModule(
            DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun subscribeToEvents() {
        Adapty.setOnProfileUpdatedListener { profile ->
            sendEvent(
                reactApplicationContext,
                DID_UPDATE_PROFILE,
                helper.toJson(profile)
            )
        }
    }
}
