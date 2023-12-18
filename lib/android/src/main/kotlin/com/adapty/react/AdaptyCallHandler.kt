package com.adapty.react

import com.adapty.Adapty
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.models.*
import com.adapty.utils.AdaptyResult
import com.facebook.react.bridge.*

var MEMO_ACTIVATE_ARGS = false

@Suppress("SpellCheckingInspection")
internal class AdaptyCallHandler(
    private val reactApplicationContext: ReactApplicationContext,
    val onActivated: () -> Unit
) {
    fun handle(ctx: AdaptyContext) {
        try {
            when (ctx.methodName) {
                MethodName.ACTIVATE -> handleActivate(ctx)
                MethodName.GET_PAYWALL -> handleGetPaywall(ctx)
                MethodName.GET_PAYWALL_PRODUCTS -> handleGetPaywallProducts(ctx)
                MethodName.GET_PROFILE -> handleGetProfile(ctx)
                MethodName.IDENTIFY -> handleIdentify(ctx)
                MethodName.LOGOUT -> handleLogout(ctx)
                MethodName.LOG_SHOW_ONBOARDING -> handleLogShowOnboarding(ctx)
                MethodName.LOG_SHOW_PAYWALL -> handleLogShowPaywall(ctx)
                MethodName.MAKE_PURCHASE -> handleMakePurchase(ctx)
                MethodName.RESTORE_PURCHASES -> handleRestorePurchases(ctx)
                MethodName.SET_FALLBACK_PAYWALLS -> handleSetFallbackPaywalls(ctx)
                MethodName.SET_LOG_LEVEL -> handleSetLogLevel(ctx)
                MethodName.SET_VARIATION_ID -> handleSetVariationId(ctx)
                MethodName.UPDATE_ATTRIBUTION -> handleUpdateAttribution(ctx)
                MethodName.UPDATE_PROFILE -> handleUpdateProfile(ctx)

                MethodName.NOT_IMPLEMENTED -> throw BridgeError.MethodNotImplemented
            }
        } catch (error: Error) {
            ctx.bridgeError(error)
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleActivate(ctx: AdaptyContext) {
        if (MEMO_ACTIVATE_ARGS) {
            return ctx.resovle()
        }
        MEMO_ACTIVATE_ARGS = true

        val apiKey: String = ctx.params.getRequiredValue(ParamKey.SDK_KEY)
        val customerUserId: String? = ctx.params.getOptionalValue(ParamKey.USER_ID)
        val logLevel: String? = ctx.params.getOptionalValue(ParamKey.LOG_LEVEL)
        val observerMode: Boolean? = ctx.params.getOptionalValue(ParamKey.OBSERVER_MODE)
        // val enableUsageLogs: Boolean? = ctx.params.getOptionalValue(ParamKey.ENABLE_USAGE_LOGS)

        CrossplatformHelper.shared.toLogLevel(logLevel)?.let {
            Adapty.logLevel = it
        }

        UiThreadUtil.runOnUiThread {
            Adapty.activate(
                context = reactApplicationContext,
                appKey = apiKey,
                observerMode = observerMode ?: false,
                customerUserId = customerUserId
            )
            onActivated()
            ctx.resovle()
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleUpdateAttribution(ctx: AdaptyContext) {
        val userId: String? = ctx.params.getOptionalValue(ParamKey.NETWORK_USER_ID)
        val attribution: Map<String, String> = ctx.params.getDecodedValue(
            ParamKey.ATTRIBUTION
        )
        val source = ctx.params.getDecodedValue(
            ParamKey.SOURCE
        ) { CrossplatformHelper.shared.toAttributionSourceType(it) }

        Adapty.updateAttribution(
            attribution,
            source,
            userId
        ) { maybeErr -> ctx.okOrForwardError(maybeErr) }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleGetPaywall(ctx: AdaptyContext) {
        val placementId: String = ctx.params.getRequiredValue(ParamKey.PLACEMENT_ID)
        val locale: String? = ctx.params.getOptionalValue(ParamKey.LOCALE)

        Adapty.getPaywall(placementId, locale) { result ->
            when (result) {
                is AdaptyResult.Success -> ctx.resolve(result.value)
                is AdaptyResult.Error -> ctx.forwardError(result.error)
            }
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleGetPaywallProducts(ctx: AdaptyContext) {
        val paywall: AdaptyPaywall = ctx.params.getDecodedValue(
            ParamKey.PAYWALL,
        )

        Adapty.getPaywallProducts(paywall) { result ->
            when (result) {
                is AdaptyResult.Success -> ctx.resolve(result.value)
                is AdaptyResult.Error -> ctx.forwardError(result.error)
            }
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleLogShowOnboarding(ctx: AdaptyContext) {
        val onboardingParams: HashMap<*, *> = ctx.params.getDecodedValue(
            ParamKey.ONBOARDING_PARAMS,
        )
        val screenOrder =
            (onboardingParams["onboarding_screen_order"] as? Number)?.toInt() ?: kotlin.run {
                throw BridgeError.TypeMismatch(
                    ParamKey.ONBOARDING_PARAMS,
                    "onboarding_screen_order not a number"
                )
            }


        Adapty.logShowOnboarding(
            onboardingParams["onboarding_name"] as? String,
            onboardingParams["onboarding_screen_name"] as? String,
            screenOrder,
        ) { maybeErr -> ctx.okOrForwardError(maybeErr) }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleLogShowPaywall(ctx: AdaptyContext) {
        val paywall: AdaptyPaywall = ctx.params.getDecodedValue(
            ParamKey.PAYWALL,
        )

        Adapty.logShowPaywall(paywall) { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleSetFallbackPaywalls(ctx: AdaptyContext) {
        val paywallsString: String = ctx.params.getRequiredValue(ParamKey.PAYWALLS)

        Adapty.setFallbackPaywalls(paywallsString) { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleSetVariationId(ctx: AdaptyContext) {
        val transactionId: String = ctx.params.getRequiredValue(ParamKey.TRANSACTION_ID)
        val variationId: String = ctx.params.getRequiredValue(ParamKey.VARIATION_ID)

        Adapty.setVariationId(
            forTransactionId = transactionId,
            variationId = variationId,
        ) { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    private fun handleGetProfile(ctx: AdaptyContext) {
        Adapty.getProfile { result ->
            when (result) {
                is AdaptyResult.Success -> ctx.resolve(result.value)
                is AdaptyResult.Error -> ctx.forwardError(result.error)
            }
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleIdentify(ctx: AdaptyContext) {
        val customerUserId: String = ctx.params.getRequiredValue(ParamKey.USER_ID)

        Adapty.identify(customerUserId) { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    private fun handleLogout(ctx: AdaptyContext) {
        Adapty.logout { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleUpdateProfile(ctx: AdaptyContext) {
        val params: AdaptyProfileParameters = ctx.params.getDecodedValue(
            ParamKey.PARAMS,
        )

        Adapty.updateProfile(params) { maybeErr ->
            ctx.okOrForwardError(maybeErr)
        }
    }

    private fun handleMakePurchase(ctx: AdaptyContext) {
        val product: AdaptyPaywallProduct = ctx.params.getDecodedValue(ParamKey.PRODUCT)
        val params: AdaptySubscriptionUpdateParameters? = ctx.params.getDecodedOptionalValue(ParamKey.PARAMS)
        val isPersonalized: Boolean? = ctx.params.getOptionalValue(ParamKey.IS_OFFER_PERSONALIZED)

        ctx.activity?.let {
            Adapty.makePurchase(
                activity = it,
                product = product,
                subscriptionUpdateParams = params,
                isOfferPersonalized = isPersonalized ?: false
            ) { result ->
                when (result) {
                    is AdaptyResult.Success -> result.value?.let { profile ->
                        ctx.resolve(profile)
                    } ?: ctx.resovle()

                    is AdaptyResult.Error -> ctx.forwardError(result.error)
                }
            }
        }
    }

    private fun handleRestorePurchases(ctx: AdaptyContext) {
        Adapty.restorePurchases { result ->
            when (result) {
                is AdaptyResult.Success -> ctx.resolve(result.value)
                is AdaptyResult.Error -> ctx.forwardError(result.error)
            }
        }
    }

    @Throws(BridgeError.TypeMismatch::class)
    private fun handleSetLogLevel(ctx: AdaptyContext) {
        val logLevel = ctx.params.getDecodedValue(ParamKey.VALUE) {
            CrossplatformHelper.shared.toLogLevel(it)
        }


        Adapty.logLevel = logLevel
        return ctx.resovle()
    }
}
