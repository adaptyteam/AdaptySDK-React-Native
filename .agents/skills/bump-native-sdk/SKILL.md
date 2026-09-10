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

**1. `react-native-adapty-sdk.podspec`** — the CocoaPods path (still the default):

```ruby
spm_dependency(s,
  url: 'https://github.com/adaptyteam/AdaptySDK-iOS.git',
  requirement: { kind: 'exactVersion', version: '<VERSION>' },
  products: ['Adapty', 'AdaptyUI', 'AdaptyPlugin']
)
```

**2. `Package.swift`** — the SwiftPM path (React Native 0.87+, `npx react-native spm`):

```swift
.package(
    url: "https://github.com/adaptyteam/AdaptySDK-iOS.git",
    exact: "<VERSION>",
    traits: [
        .defaults,
        .trait(name: "KidsMode", condition: .when(traits: ["AdaptyReactNativeKidsMode"]))
    ]
)
```

CocoaPods never reads `Package.swift` and SwiftPM never reads the podspec, so bumping only
one of them ships two different native SDKs to two sets of users. Nothing fails at build
time: the JS layer talks to `AdaptyPlugin` by method name, so the mismatch surfaces at
runtime, and only for the path that was left behind. Grep both before committing:

```bash
grep -n "version: '" react-native-adapty-sdk.podspec
grep -n 'exact:' Package.swift
```

Keep `kind: 'exactVersion'` / `exact:` unless the user asks for a different resolution
strategy (e.g. `branch`, `revision`, `upToNextMajorVersion`) — and if they do, change it in
both files.

If the new native SDK raises its own `swift-tools-version`, our `Package.swift` may need to
follow, and the required Xcode version rises for everyone on both paths.

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

### iOS: the SwiftPM path

`examples/AdaptyDevtools` covers CocoaPods only — it never reads `Package.swift`. The SwiftPM
integration is exercised by `examples/AdaptyDevtoolsSpm`, and by the `build-ios-spm` job in
`.github/workflows/ios-builds.yml` (manual, PRs into `master`, and pushes to `master`). Locally:

```bash
cd examples/AdaptyDevtoolsSpm
yarn update-sdk-full          # install the local pack
yarn update-native-modules    # `npx react-native spm` — MANDATORY, see below
xcodebuild -project ios/AdaptyDevtoolsSpm.xcodeproj -scheme AdaptyDevtoolsSpm \
  -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' -derivedDataPath ios/build/DD \
  -skipPackagePluginValidation CODE_SIGNING_ALLOWED=NO build
```

`update-native-modules` cannot be skipped: the in-build `Sync SPM Autolinking` phase runs after
Xcode has resolved the package graph, so a build started right after the pack was reinstalled
**succeeds while silently omitting the SDK**. That also means a green build proves nothing on its
own — verify the module is linked and which native SDK commit was actually resolved, not the
podspec's:

```bash
nm ios/build/DD/Build/Products/Debug-iphonesimulator/AdaptyDevtoolsSpm.app/AdaptyDevtoolsSpm.debug.dylib \
  | grep -c RNAdapty
# Package.resolved is JSON, and the pin's shape depends on its kind (`version` for an exact pin,
# `branch` + `revision` for a branch one) — read it, do not count grep context lines.
# (`require` would not work — the file has no .json extension, so node would parse it as JS.)
node -e 'const f="ios/AdaptyDevtoolsSpm.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved";const p=JSON.parse(require("fs").readFileSync(f,"utf8")).pins.find(x=>/adaptysdk-ios/i.test(x.identity));console.log(p?p.state:"ABSENT — the build did not consume Package.swift")'
```

The `build-ios-spm` job runs the same two checks, so a bump that only edits one of the two files, or
a manifest the build never consumed, fails there too.

## Commit

Format: `chore: upgrade <platform> SDK to <version>`

Examples:
- `chore: upgrade ios SDK to 3.15.3`
- `chore: upgrade android SDK to bom 3.15.2, crossplatform 3.15.6`

## Reminder

After all changes are verified, remind the user:

> Don't forget to update `cross_platform.yaml` if the cross-platform protocol version changed.
> Don't forget to bump the version in `package.json`.
