// screens/HistoryScreen.js

import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ProfileContext } from "../context/ProfileContext";

export default function HistoryScreen() {
  const { entries } = useContext(ProfileContext);

  // Format Date as “Jan 1, 2025”
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
  itemContainer: {
    marginBottom: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  entryText: {
    fontSize: 16,
    marginTop: 4,
  },
});
