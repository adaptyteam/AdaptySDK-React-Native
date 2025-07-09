// screens/HomeScreen.js

import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { ProfileContext } from "../context/ProfileContext";

export default function HomeScreen({ navigation }) {
  // Local state to hold the text input
  const [entryText, setEntryText] = useState("");

  // Pull context values
  const { addEntry, isPremium } = useContext(ProfileContext);

  // Called when user taps "Save Entry"
  function handleSave() {
    if (entryText.trim() === "") {
      Alert.alert("Please enter some text first.");
      return;
    }
    addEntry(entryText.trim());
    setEntryText("");
  }

  // Called when user taps "View History"
  function handleViewHistory() {
    if (isPremium) {
      navigation.navigate("History");
    } else {
      navigation.navigate("Paywall");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What was your focus today?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your thoughts..."
        value={entryText}
        onChangeText={setEntryText}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Entry" onPress={handleSave} />
      </View>

      <View style={styles.spacer} />

      <Button title="View History" onPress={handleViewHistory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: 12,
  },
  spacer: {
    flex: 1,
  },
});
