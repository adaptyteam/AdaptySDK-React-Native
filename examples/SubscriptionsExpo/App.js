import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { adapty, activateAdapty } from "react-native-adapty";

export default function App() {
  useEffect(() => {
    async function fetch() {
      await activateAdapty({
        sdkKey: "public_live_FWxDeuI4.z7ivzyEWRFQHkS1B3zbs",
      });
      const info = await adapty.purchases.getInfo();
      console.log(info);
    }

    fetch();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your appss!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
