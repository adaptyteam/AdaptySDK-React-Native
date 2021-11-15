package com.rnadapty.react.models

import com.adapty.models.ProductModel
import com.android.billingclient.api.SkuDetails
import com.google.gson.annotations.SerializedName

class AdaptyProductAndroid(product: ProductModel) {
    @SerializedName("skuDetails")
    var skuDetails: SkuDetails? = product.skuDetails
    @SerializedName("freeTrialPeriod")
    var freeTrialPeriod: AdaptySubscriptionPeriod? = product.freeTrialPeriod?.let { AdaptySubscriptionPeriod(it) }
    @SerializedName("localizedFreeTrialPeriod")
    var localizedFreeTrialPeriod: String? = product.localizedFreeTrialPeriod
}

class AdaptyProduct(product: ProductModel) {
    @SerializedName("vendorProductId")
    var vendorProductId = product.vendorProductId
    @SerializedName("subscriptionPeriod")
    var subscriptionPeriod: AdaptySubscriptionPeriod? = product.subscriptionPeriod?.let { AdaptySubscriptionPeriod(it) }
    @SerializedName("introductoryDiscount")
    var introductoryDiscount: AdaptyProductDiscount? = product.introductoryDiscount?.let { AdaptyProductDiscount(it) }
    @SerializedName("introductoryOfferEligibility")
    var introductoryOfferEligibility = product.introductoryOfferEligibility
    @SerializedName("price")
    var price = product.price.toDouble()
    @SerializedName("currencySymbol")
    var currencySymbol = product.currencySymbol
    @SerializedName("localizedDescription")
    var localizedDescription = product.localizedDescription
    @SerializedName("localizedTitle")
    var localizedTitle = product.localizedTitle
    @SerializedName("localizedPrice")
    var localizedPrice = product.localizedPrice
    @SerializedName("variationId")
    var variationId = product.variationId
    @SerializedName("currencyCode")
    var currencyCode = product.currencyCode
    @SerializedName("paywallName")
    var paywallName = product.paywallName
    @SerializedName("paywallABTestName")
    var paywallABTestName = product.paywallABTestName
    @SerializedName("localizedSubscriptionPeriod")
    var localizedSubscriptionPeriod = product.localizedSubscriptionPeriod
    @SerializedName("android")
    var android: AdaptyProductAndroid? = AdaptyProductAndroid(product)
}