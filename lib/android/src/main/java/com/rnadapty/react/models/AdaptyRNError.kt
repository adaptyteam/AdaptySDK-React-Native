package com.rnadapty.react.models

import com.adapty.api.AdaptyError
import com.adapty.api.AdaptyErrorCode
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
        fun from(error: AdaptyError) = AdaptyRNError(mapErrorCode(error.adaptyErrorCode), error.message, error.hashCode())

        fun from(message: String) = AdaptyRNError(AdaptyErrorCode.UNKNOWN.value, message, 0)

        private fun mapErrorCode(adaptyErrorCode: AdaptyErrorCode) = when (adaptyErrorCode) {
            AdaptyErrorCode.UNKNOWN -> 0
            AdaptyErrorCode.ADAPTY_NOT_INITIALIZED -> 1
            AdaptyErrorCode.EMPTY_PARAMETER -> 2
            AdaptyErrorCode.NO_HISTORY_PURCHASES -> 3
            AdaptyErrorCode.NO_NEW_PURCHASES -> 4
            AdaptyErrorCode.PAYWALL_NOT_FOUND -> 5
            AdaptyErrorCode.PRODUCT_NOT_FOUND -> 6

            AdaptyErrorCode.BILLING_SERVICE_TIMEOUT -> 97
            AdaptyErrorCode.FEATURE_NOT_SUPPORTED -> 98
            AdaptyErrorCode.BILLING_SERVICE_DISCONNECTED -> 99
            AdaptyErrorCode.USER_CANCELED -> 101
            AdaptyErrorCode.BILLING_SERVICE_UNAVAILABLE -> 102
            AdaptyErrorCode.BILLING_UNAVAILABLE -> 103
            AdaptyErrorCode.ITEM_UNAVAILABLE -> 104
            AdaptyErrorCode.DEVELOPER_ERROR -> 105
            AdaptyErrorCode.BILLING_ERROR -> 106
            AdaptyErrorCode.ITEM_ALREADY_OWNED -> 107
            AdaptyErrorCode.ITEM_NOT_OWNED -> 108

            AdaptyErrorCode.AUTHENTICATION_ERROR -> 201
            AdaptyErrorCode.BAD_REQUEST -> 202
            AdaptyErrorCode.REQUEST_OUTDATED -> 203
            AdaptyErrorCode.REQUEST_FAILED -> 204
            else -> adaptyErrorCode.value * 10
        }
    }
}
