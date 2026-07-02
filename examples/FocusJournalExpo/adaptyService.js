// AdaptyService.js

import { adapty } from "react-native-adapty";
import adaptyCredentials from "./adaptyCredentials";

// Start activation immediately, and export the promise.
export const activationPromise = (async () => {
  try {
    await adapty.activate(adaptyCredentials.API_KEY, {
      __ignoreActivationOnFastRefresh: __DEV__,
      logLevel: 'verbose',
    });

    // Register fallback paywalls so the SDK can serve them
    // when the network or Adapty servers are unreachable.
    // Must be called before the first getFlow / getOnboarding call.
    await adapty.setFallback({
      ios: { fileName: "ios_fallback.json" },
      android: { relativeAssetPath: "android_fallback.json" },
    });
  } catch (error) {
    console.error("Adapty activation failed:", error);
  }
})();


