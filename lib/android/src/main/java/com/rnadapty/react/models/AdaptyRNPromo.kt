package com.rnadapty.react.models
import com.adapty.api.entity.paywalls.PromoModel
import com.google.gson.annotations.SerializedName

class AdaptyRNPromo private constructor(
        @SerializedName("promoType")
        var promoType: String?,
        @SerializedName("variationId")
        var variationId: String?,
        @SerializedName("expiresAt")
        var expiresAt: String?,
        @SerializedName("paywall")
        var paywall: AdaptyRNPaywall?
) {
    companion object {
        fun from(promo: PromoModel) = AdaptyRNPromo(
                promo.promoType,
                promo.variationId,
                promo.expiresAt,
                promo.paywall?.let(AdaptyRNPaywall.Companion::from)
        )
    }
}