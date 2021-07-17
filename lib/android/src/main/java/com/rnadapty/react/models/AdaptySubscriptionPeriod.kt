package com.rnadapty.react.models

import com.adapty.models.PeriodUnit
import com.adapty.models.ProductSubscriptionPeriodModel
import com.google.gson.annotations.SerializedName

class AdaptySubscriptionPeriod(subscriptionPeriod: ProductSubscriptionPeriodModel) {
    @SerializedName("numberOfUnits")
    var numberOfUnits = subscriptionPeriod.numberOfUnits
    @SerializedName("unit")
    var unit: String = when (subscriptionPeriod.unit) {
        PeriodUnit.D -> "day"
        PeriodUnit.W -> "week"
        PeriodUnit.M -> "month"
        PeriodUnit.Y -> "year"
        null -> "unknown"
    }
}