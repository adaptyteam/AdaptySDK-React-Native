package com.rnadapty.react.models

import com.adapty.models.PaywallModel
import com.google.gson.annotations.SerializedName

class AdaptyPaywall(paywall: PaywallModel) {
    @SerializedName("revision")
    var revision = paywall.revision
    @SerializedName("visualPaywall")
    var visualPaywall = paywall.visualPaywall
    @SerializedName("products")
    var products: ArrayList<AdaptyProduct>? = ArrayList(paywall.products.map { AdaptyProduct(it) })
    @SerializedName("developerId")
    var developerId = paywall.developerId
    @SerializedName("isPromo")
    var isPromo = paywall.isPromo
    @SerializedName("variationId")
    var variationId = paywall.variationId
    @SerializedName("customPayloadString")
    var customPayloadString = paywall.customPayloadString
    @SerializedName("name")
    var name = paywall.name
    @SerializedName("abTestName")
    var abTestName = paywall.abTestName
}