// screens/PaywallScreen.js

import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ProfileContext } from "../context/ProfileContext";

export default function PaywallScreen({ navigation }) {
  const { purchasePremium } = useContext(ProfileContext);

  function handlePurchase() {
    purchasePremium();
    // After “purchase,” go back (so Home→History will now work)
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock History</Text>
      <Text style={styles.description}>
        Go premium to view all your past entries and trends.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Upgrade to Premium" onPress={handlePurchase} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#444",
  },
  buttonContainer: {
    marginHorizontal: 40,
  },
});
