// context/ProfileContext.js

import React, { createContext, useState, useEffect } from "react";

// 1) Create the context object
export const ProfileContext = createContext({});

// 2) Build a provider component
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

  // Shared state: entries array and isPremium boolean
  const [entries, setEntries] = useState(seededEntries);
  const [isPremium, setIsPremium] = useState(false);

  // Function to add a new journal entry
  function addEntry(text) {
    const newEntry = {
      id: Date.now().toString(), // unique ID
      date: new Date(),
      text: text,
    };
    // Prepend to the list (so latest is on top)
    setEntries((prev) => [newEntry, ...prev]);
  }

  // Function to “purchase” (for now, just toggles isPremium)
  function purchasePremium() {
    setIsPremium(true);
  }

  // Optionally: load saved entries/premium flag from AsyncStorage later
  // but for this quickstart, we’ll keep everything in memory.

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
