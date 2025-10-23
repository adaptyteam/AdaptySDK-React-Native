// screens/HistoryScreen.js

import React, { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { ProfileContext } from "../context/ProfileContext";
import { styles } from "../styles/HistoryScreen.styles";

export default function HistoryScreen() {
  const { entries } = useContext(ProfileContext);

  // Format Date as "Jan 1, 2025"
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Each item: show date + text
  function renderItem({ item }) {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <Text style={styles.entryText}>{item.text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}


