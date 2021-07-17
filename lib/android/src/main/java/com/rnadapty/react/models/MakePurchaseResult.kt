package com.rnadapty.react.models

import com.adapty.models.PurchaserInfoModel
import com.adapty.models.GoogleValidationResult
import com.google.gson.annotations.SerializedName

data class MakePurchaseResult(
        @SerializedName("purchaserInfo")
        val purchaserInfo: PurchaserInfoModel?,
        @SerializedName("receipt")
        val purchaseToken: String?,
        @SerializedName("googleValidationResult")
        val googleValidationResult: GoogleValidationResult?,
        @SerializedName("product")
        val product: AdaptyProduct
)