# ExpoGoWebMock Example

This is an Expo-based example app that demonstrates **Adapty SDK integration** for testing the **mock mechanism** on Expo Go and Web platforms.

## Overview

This example is specifically designed to test the Adapty SDK's mock functionality for platforms where native modules are not available (Expo Go and Web). It contains the same recipe app functionality as the BasicExample but adapted for Expo environment.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Adapty API keys in `src/helpers.ts`:
   - Replace `MOCK_TOKEN` with your actual API key
   - Replace `MOCK_PLACEMENT_ID` with your placement ID

## Running

### Expo Go (iOS/Android)
```bash
npm start
```
Then scan the QR code with Expo Go app.

### Web
```bash
npm run web
```

### Development Client
```bash
npm run local-build-client
```

### iOS Local Build
```bash
npm run local-build-ios
```

### Android Local Build
```bash
npm run local-build-android
```

## Mock Mechanism

This example is designed to work with Adapty SDK's web mock implementation. When running on Web or Expo Go, the SDK will use mock data instead of actual native functionality.

## UI Modes

The app demonstrates three paywall implementation approaches:

1. **Custom UI** - Manual implementation with full design control
2. **Modal** - Pre-built Adapty paywall as popup (`createPaywallView()`)
3. **Component** - Embedded Adapty paywall view (`<AdaptyPaywallView>`)

Switch between modes using the toggle buttons on the main screen.
