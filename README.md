<h1 align="center" style="border-bottom: none">
<b>
    <a href="https://adapty.io/?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native">
        <img src="https://adapty-portal-media-production.s3.amazonaws.com/github/logo-adapty-new.svg">
    </a>
</b>
<br>Easy In-App Purchases Integration to
<br>Make Your React Native App Profitable
</h1>

<p align="center">
<a href="https://go.adapty.io/subhub-community-react-rep"><img src="https://img.shields.io/badge/Adapty-discord-purple"></a>
<a href="http://bit.ly/39cidVJ"><img src="https://img.shields.io/npm/dt/react-native-adapty?style=flat&labelColor=6322ee&color=7E41FF&logo=yarn" alt="npm:  downloads" /></a>
<a href="http://bit.ly/39cidVJ2"><img src="https://img.shields.io/npm/v/react-native-adapty?style=flat&labelColor=6322ee&color=7E41FF&logo=npm" alt="npm: latest version" /></a>
</p>


<p align="center">
    <a href="https://adapty.io/?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native"><b>Website</b></a> •
    <a href="https://go.adapty.io/subhub-community-react-rep"><b>Discord</b></a> •
    <a href="https://twitter.com/AdaptyTeam"><b>Twitter</b></a>
</p>

![Adapty: CRM for mobile apps with subscriptions](https://adapty-portal-media-production.s3.amazonaws.com/github/adapty-schema.png)

Adapty SDK is an open-source framework that makes implementing in-app subscriptions for React Native fast and easy. It's 100% open-source and lightweight.

## Table of Contents

- [Why Adapty?](#why-adapty)
- [Getting Started](#getting-started)
- [Integrate IAPs within a few hours without server coding](#integrate-iaps-within-a-few-hours-without-server-coding)
- [Design flows in the no-code Flow Builder](#design-flows-in-the-no-code-flow-builder)
- [Test paywalls & prices on React Native without app releases](#test-paywalls--prices-on-react-native-without-app-releases)
- [Real-time analytics for your React Native app](#real-time-analytics-for-your-react-native-app)
- [Mobile app monetization's largest community](#mobile-app-monetizations-largest-community)
- [React Native Architecture Compatibility](#react-native-architecture-compatibility)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Why Adapty?

- [No server code implementation](https://adapty.io/docs/sdk-installation-reactnative?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Integrate in-app purchases with server-side receipt validation in minutes — in your own paywall or using the no-code flow builder.
- [No-code flow builder](https://adapty.io/docs/adapty-flow-builder?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Create beautiful, natively rendered single- or multi-screen flows in the no-code editor and display them in your app. With flows, you can start getting paid instantly or implement engaging onboardings in your app.
- [On-the-fly paywalls price testing](https://adapty.io/docs/ab-tests?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Test different prices, duration, offers, messages, and designs simultaneously, all without new app releases.
- [Full customer's payment history](https://adapty.io/docs/profiles-crm?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Explore the user's payment events from the trial start to subscription cancellation or billing issues.
- [3rd-party integrations](https://adapty.io/docs/events?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Send subscription events to 3rd-party analytics, attribution, and ad services with no coding, even if the user uninstalls the app.
- [Advanced analytics](https://adapty.io/docs/charts?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native). Analyze your app real-time metrics with advanced filters, such as Ad network, Ad campaign, country, A/B test, etc.

<h3 align="center" style="border-bottom: none; margin-top: -15px; margin-bottom: -15px; font-size: 150%">
<a href="https://adapty.io/schedule-demo?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native_schedule-demo">Talk to Us to Learn More</a>
</h3>

## Getting Started

### For React Native projects:

```sh
# using npm
npm install react-native-adapty 

# or using yarn
yarn add react-native-adapty
```

### For Expo projects:

```sh
npx expo install react-native-adapty
npx expo prebuild
```

Read the [documentation](https://adapty.io/docs/sdk-installation-reactnative?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native) to install and configure Adapty SDK. Set up purchases in hours instead of weeks :rocket:

### iOS requirements (since 4.0.0)

- **React Native ≥ 0.75** — required for the `spm_dependency` podspec helper that pulls the native `Adapty`, `AdaptyUI`, and `AdaptyPlugin` SDKs through Swift Package Manager.
- **Dynamic frameworks** — your `ios/Podfile` must declare:

  ```ruby
  use_frameworks! :linkage => :dynamic
  ```

  `spm_dependency` only works with dynamic frameworks. If you currently use the default static linkage you'll need to switch — be aware this can conflict with libraries that don't yet support modular headers (see the [Callstack write-up](https://www.callstack.com/blog/integrating-swift-package-manager-with-react-native-libraries)) and is incompatible with Flipper.

## Integrate IAPs within a few hours without server coding

**Adapty handles everything, from free trials to refunds, in a simple, developer-friendly SDK.**

- Free trials, upgrades, downgrades, crossgrades, family sharing, renewals, promo offers, intro offers, promo codes, and more – Adapty SDK does everything with a single line of code.
- Easy subscription management.
- One-time purchases and lifetime subscriptions supported.
- Sync subscribers' states across iOS, Android, and Web.

## Design flows in the no-code Flow Builder

![No-code Flow Builder](https://adapty-portal-media-production.s3.amazonaws.com/github/flow-cover.webp)

With the [Adapty Flow Builder](https://adapty.io/docs/adapty-flow-builder?utm_source=github&utm_medium=referral&utm_campaign=AdaptySDK-React-Native), you can visually design complete user experiences — from single-screen paywalls to multi-step onboardings, surveys, and quizzes.

- **Flexible customizable flows**: Build any kind of flow: a single-screen paywall, a multi-step sequence, a survey, or anything in between.
- **Native rendering**: The Adapty SDK renders flows natively without web views to ensure a seamless user experience.
- **Update without redeploying**: Change copy, design, pricing, or logic any time. Updates reach your users without an app release.

Adapty automatically renders your flow and handles all the complex purchase logic, receipt validation, and subscription management behind the scenes.

## Test paywalls & prices on React Native without app releases

![Adapty: In-app subscriptions with paywall A/B testing](https://adapty-portal-media-production.s3.amazonaws.com/github/ab-test-new.png)

- Optimize in-app subscriptions with the paywall A/B testing. Conversions, trials, revenue, cancellations, and more — everything is calculated for you: each paywall and each A/B test.
- Change images, colors, layouts, and literally anything using the no-code builder or a custom JSON. Configure different prices, trial periods, promo offers, and more in Adapty without app releases.

## Real-time analytics for your React Native app

![Adapty: How Adapty works](https://adapty-portal-media-production.s3.amazonaws.com/github/analyticss.gif)

- Manage the subscription's state without managing transactions.
- 99.5% accuracy.
- View and analyze data by attributes, such as status, channels, campaigns, and more.
- Filter, group, and measure metrics by attribution, platform, custom users' segments, and more in a few clicks.

## Mobile app monetization's largest community

Ask questions, participate in discussions about Adapty-related topics, become a part of our community for app developers and marketers. Learn how to monetize your app, ask questions, post jobs, read industry news and analytics. Ad free.

<a href="https://discord.gg/subscriptions-hub"><img src="https://adapty-portal-media-production.s3.amazonaws.com/github/join-discord.svg" /></a>

## React Native Architecture Compatibility

Adapty SDK is compatible with both **React Native's New Architecture** (including Turbo Modules) and the legacy architecture.


## Examples

We provide several example applications with increasing complexity:

- **[BasicExample](./examples/BasicExample/)** (React Native) – Minimal setup example showing core SDK features.
- **[ExpoGoWebMock](./examples/ExpoGoWebMock/)** (Expo Go / Expo Web) – Easiest to run (works in browser with mock mode, no Adapty key required). Demonstrates mock data usage for Expo Go/Web. Includes both custom paywall and Adapty Paywall Builder.
- **[FocusJournalExpo](./examples/FocusJournalExpo/)** (Expo) – Simple app with premium features using Adapty Paywall Builder. Includes video guide.
- **[AdaptyDevtools](./examples/AdaptyDevtools/)** (React Native) – DevTools and bug reporting tool.

📹 **Watch our video guide** for step-by-step integration with the Focus Journal Expo example:

[![Focus Journal Expo Integration Guide](https://img.youtube.com/vi/TtCJswpt2ms/hqdefault.jpg)](https://www.youtube.com/watch?v=TtCJswpt2ms)

## Contributing

- Feel free to open an issue, we check all of them or drop us an email at [support@adapty.io](mailto:support@adapty.io) and tell us everything you want.
- Want to suggest a feature? Just contact us or open an issue in the repo.

## Like Adapty SDK? 

So do we! Feel free to star the repo ⭐️⭐️⭐️ and make our developers happy!

## License

Adapty is available under the MIT license. See [LICENSE](https://github.com/adaptyteam/AdaptySDK-React-Native/blob/master/LICENSE) for details.
