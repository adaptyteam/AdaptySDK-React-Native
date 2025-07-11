// context/ProfileContext.js

import React, { createContext, useState, useEffect } from "react";
import { adapty } from "react-native-adapty";
import AdaptyConstants from "../AdaptyConstants";
import { activationPromise } from "../AdaptyService";

export const ProfileContext = createContext({});

export function ProfileProvider({ children }) {
  const seededEntries = [
    {
      id: "1",
      date: new Date(Date.now() - 86400000),
      text: "Had a productive day focusing on React Native.",
    },
    {
      id: "2",
      date: new Date(Date.now() - 2 * 86400000),
      text: "Started my focus journal today!",
    },
  ];

  const [entries, setEntries] = useState(seededEntries);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await activationPromise;

        const profile = await adapty.getProfile();

        if (profile && profile.accessLevels) {
          const level = profile.accessLevels[AdaptyConstants.ACCESS_LEVEL_ID];
          if (mounted) {
            setIsPremium(
              !!(level?.isActive || level?.isInGracePeriod || level?.isLifetime)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching Adapty profile:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function addEntry(text) {
    const newEntry = {
      id: Date.now().toString(), // unique ID
      date: new Date(),
      text: text,
    };
    // Prepend to the list (so latest is on top)
    setEntries((prev) => [newEntry, ...prev]);
  }

  function purchasePremium(updatedProfile) {
    const level = updatedProfile.accessLevels[AdaptyConstants.ACCESS_LEVEL_ID];
    setIsPremium(
      !!(level?.isActive || level?.isInGracePeriod || level?.isLifetime)
    );
  }

  // Value that will be exposed to all children
  const value = {
    entries,
    isPremium,
    addEntry,
    purchasePremium,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
