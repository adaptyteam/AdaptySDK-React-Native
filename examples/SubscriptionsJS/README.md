# Adapty: React Native Subscription App (js)
This app demonstrates how `react-native-adapty` can be used to check user access

## Prerequisites 
This app was created using [basic RN setup](https://reactnative.dev/docs/environment-setup) via `npx react-native init subscriptions_js`. Currently, it utilizes React Native v0.70.5 with Hermes engine


## Features
This application demonstrates:
* how to configure an instance of Adapty
* how to check user's purchases and their status (expired/refunded subscriptions)
* how to display a paywall
* how to display a list of products

## How to run example with production version of the library
1. Clone this repository
2. In the directory of this example fetch dependencies:
   1. `yarn` to pull node_modules
   2. `pod install --project-directory=ios` to pull iOS pods
   3. For Android you can install dependencies either via Andoid Studio or with a gradle CLI `cd android && ./gradlew wrapper`
3. Run `yarn start` to start RN development server. It will prompt you to insert your Adapty token, iOS bundle id and android app id. If you have automated flow and you don't run `start` command, you can optionally run `yarn credentials` to provide your private data
4. Now you can run the example on a device with your preferred method

## How to run example with local version of the library

As symlinks do not work with React Native, I prefer to use [wml](https://github.com/wix/wml).

0. `npm install -g wml` to install *wml*
1. Clone this repository
2. In the root directory of this library compile the library with `yarn build` or setup continous compilation with `yarn watch` (watches your changes and compiles them to JS)
3. In the directory of this example fetch dependencies:
   1. `yarn` to pull node_modules
   2. `pod install --project-directory=ios` to pull iOS pods
   3. For Android you can install dependencies either via Andoid Studio or with a gradle CLI `cd android && ./gradlew wrapper`
4. In the root of the library run `wml add . examples/SubscriptionsJS/node_modules/react-native-adapty` to create a *wml* link
5. Run `wml start` to watch JS library code changes
6. Run `yarn start` to start RN development server. It will prompt you to insert your Adapty token, iOS bundle id and android app id. If you have automated flow and you don't run `start` command, you can optionally run `yarn credentials` to provide your private data
7. Now you can run the example on a device with your preferred method

