package com.rnadapty.react.models

import com.adapty.api.entity.purchaserInfo.model.PurchaserInfoModel
import com.adapty.api.entity.validate.GoogleValidationResult
import com.google.gson.annotations.SerializedName

data class MakePurchaseResult(
        @SerializedName("purchaserInfo")
        val purchaserInfo: PurchaserInfoModel?,
        @SerializedName("receipt")
        val purchaseToken: String?,
        @SerializedName("googleValidationResult")
        val googleValidationResult: GoogleValidationResult?,
        @SerializedName("product")
        val product: AdaptyRNProduct
)