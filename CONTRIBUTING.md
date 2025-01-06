## Contribution Guide

### 1. Make sure your feature is not implemented

Browse through our [docs](https://doc.adapty.io/docs/react-native-sdk) and the [existing GitHub issues](https://github.com/adaptyteam/AdaptySDK-React-Native/issues)

### 2. Create issue to determine what's and why's

It's better to make sure that your idea is applicable to Adapty before going on. If your idea is approved to release, we will support your development till release

### 3. Fork the project and setup the development env

To develop locally you need to have Xcode and Android Studio running.

After you have done setting up Adapty locally, run following commands to make things work: 
1. `yarn` to fetch required node packages
2. `yarn pods` to install required Pods to run example iOS app (you will need to have CocoaPods installed)
3. `cd android && ./gradlew` to install required packages to develop Android app

Then you can run:
`yarn xcode` to open the library Xcode project or `yarn xcode-example` to open example-app Xcode project (might be convinient to develop there)

You can open this project in Android Studio via `yarn studio`

Run `yarn start` to start React Native server and `yarn watch` to start tsc in watch mode if needed

Notice that you will need to put your API key in `example/src/App.tsx` to validate requests 

### 4. Submit your pull request and go though reviews until releaed

Submit your pull requests and summarize your work. Some changes might be requested in order to conform one code-style. After a few days, you will be released! 🎉