package com.rnadapty.react.models

import com.adapty.models.PurchaserInfoModel
import com.adapty.models.GoogleValidationResult
import com.google.gson.annotations.SerializedName

data class RestoreResult(
        @SerializedName("purchaserInfo")
        val purchaserInfo: PurchaserInfoModel?,
        @SerializedName("googleValidationResults")
        val googleValidationResultList: List<GoogleValidationResult>?
)