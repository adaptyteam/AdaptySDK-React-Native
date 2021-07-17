package com.rnadapty.react.models
import com.adapty.models.PromoModel
import com.google.gson.annotations.SerializedName

class AdaptyPromo(promo: PromoModel) {
    @SerializedName("promoType")
    var promoType = promo.promoType
    @SerializedName("variationId")
    var variationId = promo.variationId
    @SerializedName("expiresAt")
    var expiresAt = promo.expiresAt
    @SerializedName("paywall")
    var paywall: AdaptyPaywall? = promo.paywall?.let{AdaptyPaywall(it)}
}