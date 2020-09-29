import Foundation
import Adapty

@objc(RNAdaptyEvents)
class RNAdaptyEvents: RCTEventEmitter, AdaptyDelegate, AdaptyPaywallDelegate {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return ["onPromoReceive", "onPurchaseSuccess", "onPurchaseFailed", "onPaywallClosed", "onInfoUpdate"]
  }

  @objc func check() {
    sendEvent(withName: "onPromoReceive", body: ["ma": "va"])
  }

  func didPurchase(product: ProductModel, purchaserInfo: PurchaserInfoModel?, receipt: String?, appleValidationResult: Parameters?, paywall: PaywallViewController) {
    print("[] DID PURCHASE")
    sendEvent(withName: "onPurchaseSuccess", body: ["ba": "Ba"])
  }

  func didFailPurchase(product: ProductModel, error: Error, paywall: PaywallViewController) {
    print("[] DID FAIL")
    sendEvent(withName: "onPurchaseFailed", body: ["ba": "Ba"])
  }

  func didClose(paywall: PaywallViewController) {
      sendEvent(withName: "onPaywallClosed", body: ["ba": "Ba"])
  }

  func didReceiveUpdatedPurchaserInfo(_ purchaserInfo: PurchaserInfoModel) {
    print("[] DID UPDATE")
      sendEvent(withName: "on", body: ["promo": purchaserInfo])
  }

  func didReceivePromo(_ promo: PromoModel) {
    sendEvent(withName: "onPromoReceive", body: ["promo": promo])
  }

}
