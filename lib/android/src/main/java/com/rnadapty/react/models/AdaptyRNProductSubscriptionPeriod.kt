package com.rnadapty.react.models

import com.adapty.api.entity.paywalls.ProductModel
import com.google.gson.annotations.SerializedName

class AdaptyRNProductSubscriptionPeriod private constructor(
        @SerializedName("unit")
        var unit: Int,
        @SerializedName("numberOfUnits")
        var numberOfUnits: Int
) {
    companion object {
        fun from(periodModel: ProductModel.ProductSubscriptionPeriodModel) = AdaptyRNProductSubscriptionPeriod(
                unit = unitToInt(periodModel.unit),
                numberOfUnits = periodModel.numberOfUnits ?: 0
        )

        private fun unitToInt(unit: ProductModel.PeriodUnit?) = when (unit) {
            ProductModel.PeriodUnit.D -> 0
            ProductModel.PeriodUnit.W -> 1
            ProductModel.PeriodUnit.M -> 2
            ProductModel.PeriodUnit.Y -> 3
            else -> -1
        }
    }
}