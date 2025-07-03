# Focus Journal for React Native with Expo

This repository demonstrates how to integrate the [Adapty SDK](https://adapty.io) into an existing React Native app built with Expo and EAS Build. It contains two branches:

- **`starter`**: A “clean slate” version of the Focus Journal app with no Adapty code included. Use this branch to follow the Quickstart guide and add Adapty yourself.
- **`main`**: The fully integrated version, showing the completed Adapty integration for reference.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Branch Structure](#branch-structure)  
3. [Prerequisites](#prerequisites)  
4. [Getting Started](#getting-started)  
5. [Running the Example](#running-the-example)  

---

## Project Overview

**Focus Journal** is a simple journaling app that lets users log daily entries and view their history. In the “premium” flow, tapping “History” triggers a paywall if the user is not subscribed. The Adapty SDK is used to:

1. **Activate Adapty at launch**  
2. **Fetch the user’s profile and determine access**  
3. **Display a customizable paywall UI using Paywall Builder**  
4. **Handle purchase and restore callbacks**  

You can follow along on the `feat/focus-journal-expo-starter` branch to add Adapty manually, or inspect the `master` branch to see the final result.

You can also follow along with the video tutorial which can be found [here]().

---

## Branch Structure

- **`feat/focus-journal-expo-starter`**  
  - Contains the Focus Journal app without any Adapty code.  
  - Meant as a starting point for following the Quickstart guide.  

- **`master`**  
  - Contains the same app with Adapty fully integrated.  
  - Compare this branch to `starter` to see the complete implementation.  

---

## Prerequisites

- **Node.js**  
- **Expo CLI and EAS CLI**  
- A custom **Expo Dev Client** (Expo Go will not work)  
- A valid **Adapty account** with an SDK key  
- At least one in-app purchase configured in App Store Connect and synced to Adapty  

---

## Getting Started

1. **Clone this repository**  
   ```bash
   git clone https://github.com/adaptyteam/AdaptySDK-React-Native.git
   cd examples/FocusJournalExpo
   ```

2. **Check out the starter branch**  
   ```bash
   git checkout feat/focus-journal-expo-starter
   ```

3. **Follow the Quickstart Integration Guide to add Adapty step-by-step.**

4. When you're done, or if you get stuck, switch to the `main` branch to compare your work:  
   ```bash
   git checkout master
   ```

---

## Running the Example

1. `git checkout master`  
2. Add your Adapty API key to `AdaptyConstants.js`  
3. Build your dev client and run the app:  
   ```bash
   eas build --profile development --platform ios
   npx expo start --dev-client
   ```

Note: You’ll need the products, placements, and paywalls already defined in your Adapty dashboard. See [the Adapty docs](https://adapty.io/docs/) for help.

You should now have a working Adapty integration in a React Native app using Expo. Feel free to explore the main branch to see the completed integration or continue customizing the UI.

If you find any mistakes or have questions, please open an issue or submit a pull request. Happy coding!
