import Foundation
import Adapty

@objc(RNAdaptyEvents)
class RNAdaptyEvents: RCTEventEmitter, AdaptyDelegate {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onPromoReceive", "onPurchaseSuccess", "onPurchaseFailed", "onInfoUpdate"]
  }

  @objc func check() {
    sendEvent(withName: "onInfoUpdate", body: ["test": "data"])
  }

  func didPurchase(product: ProductModel, purchaserInfo: PurchaserInfoModel?, receipt: String?, appleValidationResult: Parameters?, paywall: PaywallViewController) {
    print("[] DID PURCHASE")
    sendEvent(withName: "onPurchaseSuccess", body: ["purchase": "success"])
  }

  func didFailPurchase(product: ProductModel, error: Error, paywall: PaywallViewController) {
    print("[] DID FAIL")
    sendEvent(withName: "onPurchaseFailed", body: ["purchase": "failed"])
  }

  func didReceiveUpdatedPurchaserInfo(_ purchaserInfo: PurchaserInfoModel) {
    print("[] DID UPDATE")
      sendEvent(withName: "onInfoUpdate", body: ["promo": purchaserInfo])
  }

  func didReceivePromo(_ promo: PromoModel) {
    sendEvent(withName: "onPromoReceive", body: ["promo": promo])
  }
}
