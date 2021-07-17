package com.rnadapty.react.models

import com.adapty.models.ProductDiscountModel
import com.google.gson.annotations.SerializedName

class AdaptyProductDiscount(discount: ProductDiscountModel) {
    @SerializedName("price")
    var price: Double = discount.price.toDouble()
    @SerializedName("numberOfPeriods")
    var numberOfPeriods = discount.numberOfPeriods
    @SerializedName("localizedPrice")
    var localizedPrice = discount.localizedPrice
    @SerializedName("subscriptionPeriod")
    var subscriptionPeriod: AdaptySubscriptionPeriod = AdaptySubscriptionPeriod(discount.subscriptionPeriod)
}