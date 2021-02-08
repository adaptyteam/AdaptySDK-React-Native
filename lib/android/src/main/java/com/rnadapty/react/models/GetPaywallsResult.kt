package com.rnadapty.react.models

import com.google.gson.annotations.SerializedName

data class GetPaywallsResult(
        @SerializedName("paywalls")
        val paywalls: List<AdaptyRNPaywall>,
        @SerializedName("products")
        val products: List<AdaptyRNProduct>
)