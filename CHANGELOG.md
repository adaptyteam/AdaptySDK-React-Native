
## 0.2.4-beta
> 20 October 2020

## ⭐ Features
* Now RN SDK uses iOS Swift SDK  1.8.1 (If your pods don’t build anymore, please, run `pod update Adapty`)

## 🛠 Fixes
* Gender previously was taking values ‘m’ | ‘f’ | ‘string’, now it accepts only ‘male’ | ‘female’ | ‘other’
* Android: Paywall interface inconsistencies are fixed
* Android: makePurchase now proceeds without rejecting
* Android: building fixed
* iOS: Build warnings fixed

---

## 0.2.2-beta
> 14 October 2020

## ⭐ Features
- Android: `makePurchase()` added and tested
- Android: example app restructured and cleaned
- Android: installing SDK to an android device now downloads `com.android.billingclient` to parse purchases
- Android: `validateReceipt()` added and tested
- iOS: iOS SDK is now forced to run on a main thread
- API Documentation now contains more info!
## 🛠 Fixes
- `activateAdapty()` function is now openly asynchronous
- `customerUserId` is now an optional value to `activateAdapty()` 

---

## 0.2.0-beta
> 13 October 2020

##  ⭐ Features
* Manual linking docs added 
* Example app added 
* API docs added
* Android now supports updateProfile method
## 🛠 Fixes
* Android installation instruction added

---

## 0.1.5-rc 
> 07 October 2020

### ⭐ Features
* [Changelog added 🥳]()
* [Installation instructions for android improved](23d0dc7)
### 🛠 Fixes
* [Android: activate() customerUserId field is now optional](85be9ac6e2)
* [Android: AdaptySDK dynamic version caused errors, now version is static](e00ddfafd)
* [Android folder whitelisted for an npm package](e734e28d)

---

## 0.1.0-rc
> 06 October 2020

### ⭐ Features
* Android and iOS module initiated! 🥳

---
