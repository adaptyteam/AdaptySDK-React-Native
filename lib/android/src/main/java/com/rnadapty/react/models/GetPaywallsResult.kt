package com.rnadapty.react.models

import com.google.gson.annotations.SerializedName

data class GetPaywallsResult(
        @SerializedName("paywalls")
        val paywalls: ArrayList<AdaptyPaywall>,
        @SerializedName("products")
        val products: ArrayList<AdaptyProduct>
)