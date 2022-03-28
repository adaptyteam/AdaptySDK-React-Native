# Example RN Adapty App

## Running
1. After pulling this repository run `yarn` to install packages
2. Set your own API key in `example/src/App.tsx` (variable `ADAPTY_PUBLIC_KEY`)
3. (iOS) Run `yarn example-pods` to install pods needed to launch an iOS example
4. Run `yarn example-start` to start a development server
5. You can use either a real device or an emulation, Android or iOS from here. To start an emulation use `yarn example-ios` or `yarn example-android` accordingly. To run this example on a real device launch Xcode or Android Studio and continue there with an active development server. Refer to [the official React Native instructions](https://reactnative.dev/docs/running-on-device), if you are not sure how to do this.

## Developing a library inside the playground
Inside _example_ folder `react-native-adapty` refers not to the library itself, but to _lib/src_, which is an uncompiled directory of library. You can directly edit _lib/src_ and see results via fast refresh.