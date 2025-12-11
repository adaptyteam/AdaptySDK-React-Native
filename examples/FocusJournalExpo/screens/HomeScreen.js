// screens/HomeScreen.js

import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from "react-native";
import { ProfileContext } from "../context/ProfileContext";
import { adapty } from "react-native-adapty";
import { createPaywallView } from "react-native-adapty/dist/ui";
import adaptyCredentials from "../adaptyCredentials";
import { activationPromise } from "../adaptyService";
import { styles } from "../styles/HomeScreen.styles";

export default function HomeScreen({ navigation }) {
  // Local state to hold the text input
  const [entryText, setEntryText] = useState("");

  // Pull context values
  const { addEntry, isPremium, purchasePremium, entries } = useContext(ProfileContext);

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
  async function handleViewHistory() {
    await activationPromise;
    if (isPremium) {
      navigation.navigate("History");
    } else {
      try {
        const paywall = await adapty.getPaywall(
          adaptyCredentials.PLACEMENT_ID,
          "en"
        );
        if (paywall.hasViewConfiguration) {
          const view = await createPaywallView(paywall);
          view.registerEventHandlers({
            onCloseButtonPress() {
              return true;
            },
            onPurchaseCompleted(purchaseResult, product) {
              if (purchaseResult.type === "success") {
                purchasePremium(purchaseResult.profile);
                navigation.navigate("History");
                return true;
              }
              return false;
            },
            onPurchaseFailed(error) {
              console.error("Purchase failed:", error);
              return false;
            },
            onRestoreCompleted(restoredProfile) {
              purchasePremium(restoredProfile);
              navigation.navigate("History");
              return true;
            },
            onRestoreFailed(error) {
              console.error("Restore failed:", error);
              return false;
            },
            onRenderingFailed(error) {
              console.error("Error rendering paywall:", error);
              return false;
            },
          });
          // Present paywall; for iOS you can choose a presentation style
          // Available options: 'full_screen' (default) or 'page_sheet'
          await view.present({ iosPresentationStyle: 'page_sheet' });
        }
      } catch (error) {
        console.error("Error loading paywall:", error);
      }
    }
  }

  // Format Date as "Jan 1, 2025"
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Render masked entry preview
  function renderMaskedEntry({ item }) {
    return (
      <View style={styles.maskedItemContainer}>
        <Text style={styles.maskedDateText}>{formatDate(item.date)}</Text>
        <View style={styles.maskedContentContainer}>
          <View style={styles.maskedLine} />
          <View style={[styles.maskedLine, styles.maskedLineShort]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What was your focus today?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your thoughts..."
        placeholderTextColor="#BDC3C7"
        value={entryText}
        onChangeText={setEntryText}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>

      {entries.length > 0 && (
        <>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Recent Entries</Text>
            <Text style={styles.previewSubtitle}>
              Tap "View History" to see full content
            </Text>
          </View>

          <FlatList
            data={entries.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={renderMaskedEntry}
            style={styles.previewList}
            scrollEnabled={false}
          />
        </>
      )}

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
        <Text style={styles.secondaryButtonText}>View History</Text>
      </TouchableOpacity>
    </View>
  );
}

