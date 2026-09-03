---
name: bump-native-sdk
description: Use when upgrading native iOS or Android SDK dependency versions in the AdaptySDK React Native project — bumping the Adapty iOS SPM version or Android gradle dependency versions
---

# Bump Native SDK Version

Upgrades native Adapty SDK dependencies for iOS (Swift Package Manager) or Android (Gradle) in the React Native wrapper project.

## Arguments

Ask the user if not provided explicitly (but infer from context when obvious):
- **platform**: `ios` or `android`
- **iOS**: single `version` (applies to all three SPM products)
- **Android**: `bom_version` (adapty-bom) and `crossplatform_version` (they are independent)

## iOS

Since 4.0.0 the iOS native dependency is delivered via Swift Package Manager (not CocoaPods). Edit `react-native-adapty-sdk.podspec` — update the `spm_dependency` requirement version (a single version applies to all three products):

```ruby
spm_dependency(s,
  url: 'https://github.com/adaptyteam/AdaptySDK-iOS.git',
  requirement: { kind: 'exactVersion', version: '<VERSION>' },
  products: ['Adapty', 'AdaptyUI', 'AdaptyPlugin']
)
```

Keep `kind: 'exactVersion'` unless the user asks for a different resolution strategy (e.g. `branch`, `revision`, `upToNextMajorVersion`).

## Android

Edit `android/build.gradle` — update two dependency versions:

```gradle
implementation platform('io.adapty:adapty-bom:<BOM_VERSION>')
implementation 'io.adapty.internal:crossplatform:<CROSSPLATFORM_VERSION>'
```

`bom_version` and `crossplatform_version` are independent and typically differ.

## Verification

After editing source files, build and test devtools example app. Run all commands from project root:

```bash
cd examples/AdaptyDevtools
yarn
yarn update-sdk-full
yarn update-native-modules
```

1. `yarn` — install dependencies
2. `yarn update-sdk-full` — rebuild and install local SDK package
3. `yarn update-native-modules` — run `pod install --repo-update` in `ios/` dir

Run all three steps regardless of platform. `update-sdk-full` is platform-agnostic and is what puts the edited `android/build.gradle` into `examples/AdaptyDevtools/node_modules/react-native-adapty`, which is the copy Gradle actually compiles — so run it before any Android build, not just for iOS.

### iOS: resolving the SPM pin

`pod install` is **not** enough on its own. It rewrites only the gitignored `Pods/Pods.xcodeproj`, and leaves the tracked

`examples/AdaptyDevtools/ios/AdaptyRnSdkExample.xcworkspace/xcshareddata/swiftpm/Package.resolved`

holding whatever it held before — including a stale `branch` pin from a previous bump, which must never reach a release. Resolve it explicitly:

```bash
cd examples/AdaptyDevtools/ios
xcodebuild -resolvePackageDependencies -workspace AdaptyRnSdkExample.xcworkspace -scheme AdaptyRnSdkExample
```

Then confirm the tracked lockfile, not the gitignored project:

```bash
grep -A6 'AdaptySDK-iOS' examples/AdaptyDevtools/ios/AdaptyRnSdkExample.xcworkspace/xcshareddata/swiftpm/Package.resolved
```

It must show `"version" : "<VERSION>"` and **no** `"branch"` key. `Package.resolved` goes in the commit.

`examples/AdaptyDevtools/ios/Podfile.lock` normally does **not** change: the Adapty iOS SDK has no CocoaPods footprint any more, and CocoaPods does not recompute the checksum of a `:path`-based local pod on a plain `pod install`. Commit it only if it actually changed.

## Commit

Format: `chore: upgrade <platform> SDK to <version>`

Examples:
- `chore: upgrade ios SDK to 3.15.3`
- `chore: upgrade android SDK to bom 3.15.2, crossplatform 3.15.6`

## Reminder

After all changes are verified, remind the user:

> Don't forget to update `cross_platform.yaml` if the cross-platform protocol version changed.
> Don't forget to bump the version in `package.json`.
