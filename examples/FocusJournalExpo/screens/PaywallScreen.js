// screens/PaywallScreen.js

import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ProfileContext } from "../context/ProfileContext";
import { styles } from "../styles/PaywallScreen.styles";

export default function PaywallScreen({ navigation }) {
  const { purchasePremium } = useContext(ProfileContext);

  function handlePurchase() {
    purchasePremium();
    // After "purchase," go back (so Home→History will now work)
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock History</Text>
      <Text style={styles.description}>
        Go premium to view all your past entries and trends.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


