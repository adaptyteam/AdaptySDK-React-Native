export const AdaptyEvent = Object.freeze({
  onLoadLatestProfile: 'onLatestProfileLoad',
  onDeferredPurchase: 'onDeferredPurchase',
});
export type AdaptyEvent = typeof AdaptyEvent[keyof typeof AdaptyEvent];
