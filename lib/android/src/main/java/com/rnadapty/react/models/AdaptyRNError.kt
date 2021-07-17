package com.rnadapty.react.models

import com.adapty.errors.AdaptyError
import com.adapty.errors.AdaptyErrorCode
import com.google.gson.annotations.SerializedName

class AdaptyRNError private constructor(
        @SerializedName("adaptyCode")
        val adaptyCode: Int,
        @SerializedName("localizedDescription")
        val message: String,
        @SerializedName("code")
        val code: Int
) {
    companion object {
        fun from(error: AdaptyError) = AdaptyRNError(mapErrorCode(error.adaptyErrorCode), error.message.orEmpty(), error.hashCode())

        fun from(message: String) = AdaptyRNError(AdaptyErrorCode.UNKNOWN.value, message, 0)

        private fun mapErrorCode(adaptyErrorCode: AdaptyErrorCode) = when (adaptyErrorCode) {
            AdaptyErrorCode.UNKNOWN -> 0
            AdaptyErrorCode.USER_CANCELED -> 2
            AdaptyErrorCode.ITEM_UNAVAILABLE -> 5
            AdaptyErrorCode.ADAPTY_NOT_INITIALIZED -> 20
            AdaptyErrorCode.PAYWALL_NOT_FOUND -> 21
            AdaptyErrorCode.PRODUCT_NOT_FOUND -> 22
            AdaptyErrorCode.INVALID_JSON -> 23
            AdaptyErrorCode.CURRENT_SUBSCRIPTION_TO_UPDATE_NOT_FOUND_IN_HISTORY -> 24
            AdaptyErrorCode.BILLING_SERVICE_TIMEOUT -> 97
            AdaptyErrorCode.FEATURE_NOT_SUPPORTED -> 98
            AdaptyErrorCode.BILLING_SERVICE_DISCONNECTED -> 99
            AdaptyErrorCode.BILLING_SERVICE_UNAVAILABLE -> 102
            AdaptyErrorCode.BILLING_UNAVAILABLE -> 103
            AdaptyErrorCode.DEVELOPER_ERROR -> 105
            AdaptyErrorCode.BILLING_ERROR -> 106
            AdaptyErrorCode.ITEM_ALREADY_OWNED -> 107
            AdaptyErrorCode.ITEM_NOT_OWNED -> 108
            AdaptyErrorCode.NO_PURCHASES_TO_RESTORE -> 1004
            AdaptyErrorCode.FALLBACK_PAYWALLS_NOT_REQUIRED -> 1008
            AdaptyErrorCode.AUTHENTICATION_ERROR -> 2002
            AdaptyErrorCode.BAD_REQUEST -> 2003
            AdaptyErrorCode.SERVER_ERROR -> 2004
            AdaptyErrorCode.REQUEST_FAILED -> 2005
            AdaptyErrorCode.MISSING_PARAMETER -> 2007
            else -> adaptyErrorCode.value * 10
        }
    }
}
