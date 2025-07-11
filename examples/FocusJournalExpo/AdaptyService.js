// AdaptyService.js

import { adapty } from "react-native-adapty";
import AdaptyConstants from "./AdaptyConstants";

// Start activation immediately, and export the promise.
export const activationPromise = (async () => {
  try {
    await adapty.activate(AdaptyConstants.API_KEY);
  } catch (error) {
    console.error("Adapty activation failed:", error);
  }
})();
