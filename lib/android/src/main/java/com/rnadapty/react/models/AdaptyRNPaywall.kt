package com.rnadapty.react.models

import com.adapty.api.entity.paywalls.PaywallModel
import com.google.gson.annotations.SerializedName

class AdaptyRNPaywall {
    @SerializedName("developerId")
    var developerId: String? = null
    @SerializedName("revision")
    var revision: Int? = 0
    @SerializedName("isPromo")
    var isPromo: Boolean? = false
    @SerializedName("variationId")
    var variationId: String? = ""
    @SerializedName("products")
    var products: ArrayList<AdaptyRNProduct>? = ArrayList()
    @SerializedName("customPayloadString")
    var customPayloadString: String? = null
    @SerializedName("name")
    var name: String? = null
    @SerializedName("abTestName")
    var abTestName: String? = null

    companion object {
        fun from(paywall: PaywallModel) = AdaptyRNPaywall().apply {
            developerId = paywall.developerId
            revision = paywall.revision
            isPromo = paywall.isPromo
            variationId = paywall.variationId
            customPayloadString = paywall.customPayloadString
            name = paywall.name
            abTestName = paywall.abTestName
            products = paywall.products?.mapTo(ArrayList(), AdaptyRNProduct.Companion::from)
        }
    }
}