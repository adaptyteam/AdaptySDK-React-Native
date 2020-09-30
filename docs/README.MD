# Adapty SDK React-Native Documentation
* [Advanced initialization](#advanced-initialization)
  * [Initialization point](#initialization-point)
  * [Possible arguments](#possible-arguments)
  * [Initialization example](#initialization-example)
* [User methods](#user_methods)

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
      observerMode: true
    });
  },[]);
  ...
}
```

## User methods
### Available methods
|Method|iOS|Android|
|---     |---|---|
|identify|👌|❌|
|updateProfile|👌|❌|
|logout|👌|❌|

## Purchases methods
### Available methods
|Method|iOS|Android|
|---    |---|---|
|getInfo|👌|❌|
|makePurchase|👌|❌|
|restore|👌|❌|
|validate|👌|❌|

## Promo methods
### Available methods
|Method|iOS|Android|
|---     |---|---|
|getPromo|👌|❌|

## Paywall methods
### Available methods
|Method|iOS|Android|
|---        |---|---|
|getPaywalls|👌|❌|


