import Foundation
import Adapty

@objc(RNAdaptyEvents)
class RNAdaptyEvents: RCTEventEmitter, AdaptyDelegate {
  var hasListeners = false

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func startObserving() {
    hasListeners = true
  }
  override func stopObserving() {
    hasListeners = false
  }

  override func supportedEvents() -> [String]! {
    return ["onPromoReceived", "onPurchaseSuccess", "onPurchaseFailed", "onInfoUpdate"]
  }

  @objc func check() {
    self.sendEvent(withName: "onInfoUpdate", body: ["test": "data"])
  }

  @objc
  func didPurchase(product: ProductModel, purchaserInfo: PurchaserInfoModel?, receipt: String?, appleValidationResult: Parameters?, paywall: PaywallViewController) {
    if hasListeners {
      self.sendEvent(withName: "onPurchaseSuccess", body: ["purchase": "success"])
    }
  }

  @objc
  func didFailPurchase(product: ProductModel, error: Error, paywall: PaywallViewController) {
    if hasListeners {
      self.sendEvent(withName: "onPurchaseFailed", body: ["purchase": "failed"])
    }
  }

  @objc
  func didReceiveUpdatedPurchaserInfo(_ purchaserInfo: PurchaserInfoModel) {
    if hasListeners {
      self.sendEvent(withName: "onInfoUpdate", body: ["promo": purchaserInfo])
    }
  }

  func didReceivePromo(_ promo: PromoModel) {
    if hasListeners {
      self.sendEvent(withName: "onPromoReceived", body: ["promo": promo])
    }
  }
}
