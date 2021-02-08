package com.rnadapty.react.models

import com.adapty.api.entity.paywalls.ProductModel
import com.google.gson.annotations.SerializedName

class AdaptyRNDiscount private constructor(
        @SerializedName("price")
        var price: Double,
        @SerializedName("numberOfPeriods")
        var numberOfPeriods: Int,
        @SerializedName("localizedPrice")
        var localizedPrice: String,
        @SerializedName("subscriptionPeriod")
        var subscriptionPeriod : AdaptyRNProductSubscriptionPeriod
) {
    companion object {
        fun from(discount: ProductModel.ProductDiscountModel) = AdaptyRNDiscount(
                discount.price.toDouble(),
                discount.numberOfPeriods,
                discount.localizedPrice,
                AdaptyRNProductSubscriptionPeriod.from(discount.subscriptionPeriod)
        )
    }
}