# Adapty React-Native SDK Documentation
* [Advanced initialization](#advanced-initialization)
  * [Initialization point](#initialization-point)
  * [Possible arguments](#possible-arguments)
  * [Initialization example](#initialization-example)
* [User methods](#user-methods)
  * [Identifying user after initialization with `adapty.user.identify`](#identifying-user-after-initialization-with-adaptyuseridentify)
  * [Collecting information about user with `adapty.user.updateProfile`](#collecting-information-about-user-with-adaptyuserupdateProfile)
  * [Disassociating device with current user with `adapty.user.logout`](#disassociating-device-with-current-user-with-adaptyuserlogout)
* [Purchases methods](#purchases-methods)
  * [Acquiring user purchases status with `adapty.purchases.getInfo`](#acquiring-user-purchases-status-with-adaptypurchasesgetInfo)
  * [Making Purchases with `adapty.purchases.makePurchase`](#making-purchases-with-adaptypurchasesmakepurchase)
  * [Restoring unresolved purchases with `adapty.purchases.restore`](#restoring-unresolved-purchases-with-adaptypurchasesrestore)
  * [Validating receipts with `adapty.purchases.validate`](#validating-receipts-with-adaptypurchasesvalidate)
* [Promo methods](#promo-methods)
  * [Getting available promos with `adapty.promo.getPromo`](#getting-available-promos-with-adaptypromogetpromo)
* [Paywall methods](#paywall-methods)
  * [Collecting all paywalls with `adapty.paywalls.getPaywalls`](#collecting-all-paywalls-with-adaptypaywallsgetpaywalls)
* [Attribution](#attribution)
* [Listening to events](#listening-to-events)

## Advanced initialization
### Initialization point
Currently, you can initialize Adapty SDK using `activateAdapty` function. It is better to place it in a core component, such as `App.js`, for several reasons:
* You want to make sure, that function was mounted before you've used any other Adapty method, otherwise methods would throw an error
* You want to make sure, that your app won't unload initialization from memory, as it can be used to log notifications

### Possible arguments
`activateAdapty` function takes an `AdaptyActivateProps` object as an argument. It has these possible keys:
<table>
<tr>
<td><b>Key</b></td>
<td><b>Obligatory</b></td>
<td><b>Type</b></td>
<td><b>Description</b></td>
</tr>
<tr>
<td>sdkKey</td>
<td>YES</td>
<td>string</td>
<td>Your public Adapty SDK key</td>
</tr>
<tr>
<td>customerUserId</td>
<td>NO</td>
<td>string | undefined</td>
<td>Any value to identify user. Makes it easier to find this user in Adapty Dashboard. Provide alongside authorization if possible. Otherwise, you can use user.identify() method. Default is <i>undefined</i></td>
</tr>
<tr>
<td>observerMode</td>
<td>NO</td>
<td>boolean</td>
<td>In some cases, if you have already built a functioning subscription system, it may not be possible or feasible to use the Adapty SDK to make purchases. However, you can still use the SDK to get access to the data. Default is <i>false</i></td>
</tr>
<tr>
<td>logLevel</td>
<td>NO</td>
<td>'verbose' | 'errors' | 'none'</td>
<td>You can enable logs to debug methods you use. Currently logs are displayed in XCode only. Default is <i>'none'</i></td>
</tr>
</tr>
</table>

### Initialization Example
```ts
import { activateAdapty } from 'react-native-adapty';

const App: React.FC = () => {
  ...
  useEffect(() => {
    activateAdapty({
      sdkKey: "YOUR_PUBLIC_SDK_KEY",
      customerUserId: store.user.id,
      observerMode: true,
      logLevel: "verbose",
    });
  },[]);
  ...
}
```

## User methods
### Identifying user after initialization with `adapty.user.identify`
> iOS: 👌, Android 👌

If you don't know any ID of your user, for example, if your user hasn't authorized yet, you can set `customerUserId` after SDK has initialized. To do so you can use `adapty.user.identify( userId: string )` method.

```ts
adapty.user.identify(user.id);
```

### Collecting information about user with `adapty.user.updateProfile`
> iOS: 👌, Android 👌

You can add optional information to your user, such as email, phone number, etc. or update it with analytics ids to make tracking even more precise.

```ts
adapty.user.updateProfile({ firstName, email });
```

### Disassociating device with current user with `adapty.user.logout`
> iOS: 👌, Android 👌

Disconnects a device from a current adapty customerId. Should be called on logging out.

```ts
adapty.user.logout();
```

## Purchases methods
### Acquiring user purchases status with `adapty.purchases.getInfo`
> iOS: 👌, Android 👌

If your user obtains any product or subscription, you can easily get such information.
Methods supports caching. This way data would be fetched on app initialization and reused on call. 

```ts
const info = await adapty.purchases.getInfo();

// If you don't want to refetch
const infoCached = await adapty.purchases.getInfo({ cached: true });

// For example, check if user has active subscription
const isUserSubscribed = info.accessLevels?.level_configured_in_dashboard?.isActive;
```

### Making Purchases with `adapty.purchases.makePurchase`
> iOS: 👌, Android 👌
> In order for this to work, please, make sure you have filled Apple Connect products into Adapty Dashboard
> ⚠️ Products won't be fetched on a simulator due to simulator limitations

You can perform native purchases and log them to your Adapty dashboard in one action. This function will return a receipt and a product user has purchased on completion.
Method refetches native product data, thus supports caching.

```ts
const purchase = await adapty.purchases.makePurchase('500_coins');

// if you don't want to refetch native product data
adapty.purchases.makePurchase('500_coins', { caching: true })
```

### Restoring unresolved purchases with `adapty.purchases.restore`
> iOS: 👌, Android 👌

You can restore user's purchases using `restore`. If it succeeds, you will be able to find user's products with `adapty.purchases.getInfo` 

```ts
adapty.purchases.restore();
```

### Validating receipts with `adapty.purchases.validate`
> iOS: 👌, Android 👌

You can easily validate receipts with Adapty SDK

```ts
adapty.purchases.validateReceipt(productId, receipt);
```

## Promo methods
### Getting available promos with `adapty.promo.getPromo`
> iOS: 👌, Android 👌

You can get available promotional offers available to user with

```ts
adapty.promo.getPromo();
```

## Paywall methods
> We are currently working on enhancing a proccess of displaying paywalls, stay tuned!

### Collecting all paywalls with `adapty.paywalls.getPaywalls`
> iOS: 👌, Android 👌

You can manually get a list of available paywalls and products. Method supports caching on app initialization.

```ts
adapty.paywalls.getPaywalls();

// if you want to use cached paywalls
adapty.paywalls.getPaywalls({ cached: true });
```

## Attribution
> We will provide examples how to sync attribution via RN libraries in due time, stay tuned!

> ⚠️ Please, note, that for an adapty profile one _source_ attribution fetches only once — i.e. if you try to pass `AppleSearchAds` attribution twice, you will only be able to find the one you've passed first

Adapty has support for most popular attribution systems which allows you to track how much revenue was driven by each source and ad network.
To integrate with attribution system, just pass attribution you receive to Adapty method.

Currently, Adapty has support for the following sources: `"AppleSearchAds"`, `"Adjust"`, `"AppsFlyer"`, `"Branch"` and `"Custom"`.


```ts
adapty.updateAttribution(attributionObject, "source")
```

## Listening to events

> ⚠️ Current WIP, might be unstable. At the moment, callbacks do not return any data, which will be fixed in the nearest future

You can listen to Adapty events.

```ts
adapty.addEventListener('eventName', (data) => console.log('event fired'));
```

Current events:

|Event name          | Description   |
|--------------------|---|
|`onPurchaseSuccess` |Fires, after a successful purchase    |
|`onPurchaseFailed`  |Fires, after an unsuccessful purchase   |
|`onInfoUpdate`      |Fires, when user's purchases info changes: new products owned, subscriptions revoked or expired  |
|`onPromoReceived`   |Fires, whenever user receives a change in the promotional paywall   |

