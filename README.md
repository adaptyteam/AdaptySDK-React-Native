<h1 align="center">
<img src="https://raw.githubusercontent.com/adaptyteam/AdaptySDK-iOS/master/adapty.png"><br />
Adapty React-Native SDK
</h1>

## Requirements
* React Native v0.60+
* React v16.3+

## Installation

1. Run an installation command:

```sh
yarn add react-native-adapty
```

or 

```sh
npm i react-native-adapty --save
```

2. Install required iOS pods:

```sh
cd ios && pod install && cd ../
```

3. All Done!

## Initialization

Initialize Adapty SDK __in a core component__. You can use a special hook or a function, 
depending of what code-style you prefer. Consider those are the same:

```tsx
import { useAdapty } from "react-native-adapty";

const App: React.FC = () => {
  ...
  useAdapty({ sdkKey: "YOUR_SDK_KEY" });
  ...
}
```

or

```tsx
import { activateAdapty } from "react-native-adapty";

const App: React.FC = () => {
  ...
  useEffect(() => {
    activateAdapty({ sdkKey: "YOUR_SDK_KEY" });
  },[]);
  ...
}
```

or

```tsx
import { activateAdapty } from "react-native-adapty";

class App extends Component {
  ...
  componentDidMount() {
    activateAdapty({ sdkKey: "YOUR_SDK_KEY" });
  }
  ...
}
```

Whatever method you've chosen, you have to replace `YOUR_SDK_KEY` with your public SDK key. You can obtain one by signing up on [Adapty website](https://adapty.io).

There are also several optional parameters, you can pass during initialization. These are `customerUserId`, `observerMode` and `logLevel`.

## Usage

In this SDK you may find two types of callable methods: API requests and event emitters.

### Using API methods

For the most part, you would be using API requests: they are promises categorized inside the `adapty` instance.

Most of these methods can throw an error typed as `AdaptyError`, make sure to handle those as you need.

```ts
import { adapty } from "react-native-adapty";

// for example
adapty.user.updateProfile({
  name: "John Doe"
});

// or
adapty.purchases.makePurchase('500_coins');
```

### Using event emitters

Sometimes you want to subscribe user to an Adapty-connected update. In order to create an event listener, you should use `addEventListener` method of the `adapty` instance:

```ts
// for example
adapty.addEventListener('onPaywallClosed', () => {
  Alert.alert("Paywall closed");
});

// or
adapty.addEventListener('onPurchaseFailed', error => {
  navigate("ViewError", { error })
})
```
## License