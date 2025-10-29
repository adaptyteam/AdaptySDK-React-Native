// App.js

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import the three screens we'll create
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import PaywallScreen from "./screens/PaywallScreen";

// Import the ProfileProvider
import { ProfileProvider } from "./context/ProfileContext";

// Import theme colors
import { colors } from "./styles/theme";

// Create a Stack Navigator
const Stack = createNativeStackNavigator();

// Common screen options for consistent styling
const screenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 18,
  },
  headerShadowVisible: true,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

export default function App() {
  return (
    // 1) Wrap everything in ProfileProvider so all screens see the context
    <ProfileProvider>
      {/* 2) Wrap screens in NavigationContainer for React Navigation */}
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
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
