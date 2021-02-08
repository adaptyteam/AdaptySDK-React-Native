package com.rnadapty.react.models

import com.adapty.api.entity.purchaserInfo.model.PurchaserInfoModel
import com.adapty.api.entity.validate.GoogleValidationResult
import com.google.gson.annotations.SerializedName

data class RestoreResult(
        @SerializedName("purchaserInfo")
        val purchaserInfo: PurchaserInfoModel?,
        @SerializedName("googleValidationResults")
        val googleValidationResultList: List<GoogleValidationResult>?
)