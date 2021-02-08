package com.rnadapty.react.models

import com.adapty.api.entity.paywalls.ProductModel
import com.android.billingclient.api.SkuDetails
import com.google.gson.annotations.SerializedName

class AdaptyRNProduct {
    @SerializedName("vendorProductId")
    var vendorProductId: String? = null

    @SerializedName("title")
    var localizedTitle: String? = null

    @SerializedName("localizedDescription")
    var localizedDescription: String? = null

    @SerializedName("variationId")
    var variationId: String? = null

    @SerializedName("price")
    var price: Double? = null

    @SerializedName("localizedPrice")
    var localizedPrice: String? = null

    @SerializedName("currencyCode")
    var currencyCode: String? = null

    @SerializedName("currencySymbol")
    var currencySymbol: String? = null

    @SerializedName("subscriptionPeriod")
    var subscriptionPeriod: AdaptyRNProductSubscriptionPeriod? = null

    @SerializedName("introductoryOfferEligibility")
    var introductoryOfferEligibility = true

    @SerializedName("promotionalOfferEligibility")
    var promotionalOfferEligibility = true

    @SerializedName("introductoryDiscount")
    var introductoryDiscount: AdaptyRNDiscount? = null

    @SerializedName("skuDetails")
    var skuDetails: SkuDetails? = null

    companion object {
        fun from(product: ProductModel) = AdaptyRNProduct().apply {
            vendorProductId = product.vendorProductId
            localizedTitle = product.localizedTitle
            localizedDescription = product.localizedDescription
            variationId = product.variationId
            price = product.price?.toDouble()
            localizedPrice = product.localizedPrice
            currencyCode = product.currencyCode
            currencySymbol = product.currencySymbol
            subscriptionPeriod = product.subscriptionPeriod?.let(AdaptyRNProductSubscriptionPeriod.Companion::from)
            introductoryOfferEligibility = product.introductoryOfferEligibility
            promotionalOfferEligibility = product.promotionalOfferEligibility
            introductoryDiscount = product.introductoryDiscount?.let(AdaptyRNDiscount.Companion::from)
            skuDetails = product.skuDetails
        }
    }
}