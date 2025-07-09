// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import the three screens we'll create
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PaywallScreen from "./screens/PaywallScreen";

// Import the ProfileProvider
import { ProfileProvider } from "./context/ProfileContext";

// Create a Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 1) Wrap everything in ProfileProvider so all screens see the context
    <ProfileProvider>
      {/* 2) Wrap screens in NavigationContainer for React Navigation */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Focus Journal" }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: "History" }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{ title: "Premium" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}
