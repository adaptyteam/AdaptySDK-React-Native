// swift-tools-version: 6.2
import PackageDescription

// Swift Package Manager manifest for react-native-adapty.
//
// It is consumed by React Native's experimental SwiftPM integration (RN 0.87+,
// `npx react-native spm`). The autolinker detects this hand-written manifest,
// skips scaffolding one from the podspec, and references this directory through
// `ios/build/generated/autolinking/libs/ReactNativeAdapty` — a symlink whose
// depth is what the relative React package path below is resolved against.
//
// The product name must match the Swift name the autolinker derives from the
// npm package name ("react-native-adapty" -> "ReactNativeAdapty"), because the
// generated aggregator references it as
// `.product(name: "ReactNativeAdapty", package: "ReactNativeAdapty")`.
//
// CocoaPods remains the default integration path; see
// react-native-adapty-sdk.podspec. Keep the AdaptySDK-iOS version below in sync
// with the `spm_dependency` requirement declared there.

let package = Package(
    name: "ReactNativeAdapty",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "ReactNativeAdapty",
            targets: ["AdaptyReactNative", "AdaptyReactNativeObjC"])
    ],
    traits: [
        .default(enabledTraits: []),
        .trait(
            name: "AdaptyReactNativeKidsMode",
            description: "COPPA / App Store Kids Category build — enables the KidsMode trait of AdaptySDK-iOS (compiles out IDFA/AdSupport)."
        )
    ],
    dependencies: [
        // React Native's prebuilt header xcframeworks, generated per app by
        // `npx react-native spm` into <app>/ios/build/xcframeworks.
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(
            url: "https://github.com/adaptyteam/AdaptySDK-iOS.git",
            exact: "4.1.2",
            traits: [
                .defaults,
                .trait(name: "KidsMode", condition: .when(traits: ["AdaptyReactNativeKidsMode"]))
            ]
        )
    ],
    targets: [
        // RCT_EXTERN_MODULE declarations. They only register the Swift classes
        // with the React Native bridge by name, so this target has no
        // compile-time dependency on the Swift one — which is what lets the
        // sources be split into two targets (SwiftPM cannot mix languages).
        .target(
            name: "AdaptyReactNativeObjC",
            dependencies: [
                // Link-time only: the categories below reference the Swift classes,
                // so this target must not be linked without that one.
                "AdaptyReactNative",
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative")
            ],
            path: "ios",
            sources: [
                "AdaptyFlowViewManager.m",
                "AdaptyOnboardingViewManager.m",
                "RNAdapty.m"
            ],
            publicHeadersPath: "."),
        .target(
            name: "AdaptyReactNative",
            dependencies: [
                .product(name: "Adapty", package: "AdaptySDK-iOS"),
                .product(name: "AdaptyUI", package: "AdaptySDK-iOS"),
                .product(name: "AdaptyPlugin", package: "AdaptySDK-iOS"),
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative")
            ],
            path: "ios",
            sources: [
                "AdaptyFlowViewManager.swift",
                "AdaptyFlowWrapperView.swift",
                "AdaptyOnboardingViewManager.swift",
                "AdaptyOnboardingWrapperView.swift",
                "RNAdapty.swift"
            ],
            swiftSettings: [.swiftLanguageMode(.v5)])
    ]
)
