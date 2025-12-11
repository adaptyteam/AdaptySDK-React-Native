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
  } catch (error) {
    console.error("Adapty activation failed:", error);
  }
})();


