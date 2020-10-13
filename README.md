<h1 align="center">
<img src="https://raw.githubusercontent.com/adaptyteam/AdaptySDK-iOS/master/adapty.png"><br />
Adapty React-Native SDK
</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/react-native-adapty"><img src="https://img.shields.io/npm/dt/react-native-adapty?style=for-the-badge" alt="npm:  downloads" /></a>
  <a href="https://www.npmjs.com/package/react-native-adapty"><img src="https://img.shields.io/npm/v/react-native-adapty?style=for-the-badge" alt="npm: latest version" /></a>
</p>


* [Prerequisites](#prerequisites)
* [Requirements](#requirements)
* [Installation](#installation)
* [Initialization](#initialization)
* [Usage](#usage)
* [License](#license)

## Prerequisites

This package is currently in beta. Please, consider it, if you have decided to use it.

## Requirements
* React Native v0.60+

## Installation

> Lower you will find instructions how to install Adapty via autolinking feature. If you have to link this library manually, please, look through [this doc](docs/manual_linking.md) instead.

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

3. For android devices you currently need to add Kotlin in `android/build.gradle` and to enable multiDex in your `app/build.gradle`:

```diff
// android/build.gradle

...
buildscript {
  ...
  dependencies {
    ...
+   classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.4.0"
  }
}
...
```

```diff
// android/app/build.gradle

...
android {
  ...
  defaultConfig {
    ...
+   multiDexEnabled true
  }
}
```

4. All set! 🎉

## Initialization

Initialize Adapty SDK __in a core component__. You can use a function inside , 
depending of what code-style you prefer. Consider those are the same:

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

You can find extended API documentation [inside the docs folder](/docs).

#### Example

```ts
import { adapty } from "react-native-adapty";

// for example
adapty.user.updateProfile({
  name: "John Doe"
});

// or
adapty.purchases.makePurchase('500_coins');
```

### Using event listeners

> ⚠️ Listeners are current WIP — they might work inconsistently on iOS and they won't work on Android.

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

Adapty is available under the MIT license. See [LICENSE](https://github.com/adaptyteam/AdaptySDK-React-Native/blob/master/LICENSE) for details.
