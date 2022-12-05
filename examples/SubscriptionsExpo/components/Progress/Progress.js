import React, { useState } from "react";
import { TouchableHighlight, View, StyleSheet } from "react-native";

import { ScreenInvalidCredentials } from "../../screens/ScreenInvalidCredentials";
import { ScreenInvalidActivation } from "../../screens/ScreenInvalidActivation";
import { ScreenInvalidUserFetch } from "../../screens/ScreenInvalidUserFetch";
import { ScreenInvalidPaywallsFetch } from "../../screens/ScreenInvalidPaywallsFetch";
import { colors } from "../Colors";
import { Body, H3 } from "../Text";
import { Modal } from "./Modal";

/*
 * Progress component displays an information
 * about all stages of the subscription process
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 *
 * Props:
 * 'credentials': bool, 'activation': bool, 'access': bool
 */
export const Progress = React.memo((props) => {
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [paywallsOpen, setPaywallsOpen] = useState(false);

  const getStyle = (stage) => {
    switch (props[stage]) {
      case true:
        return styles.textOk;
      case false:
        return styles.textError;
      default:
        return styles.textWaiting;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <H3>This is how apps with Adapty work:</H3>

        <TouchableHighlight
          underlayColor={colors.primary10}
          onPress={() => setCredentialsOpen(true)}
        >
          <Body style={getStyle("credentials")}>
            0. Reading your credentials (example-only)
          </Body>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor={colors.primary10}
          onPress={() => setActivationOpen(true)}
        >
          <Body style={getStyle("activation")}>
            1. Activating Adapty instance
          </Body>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor={colors.primary10}
          onPress={() => setAccessOpen(true)}
        >
          <Body style={getStyle("access")}>2. Fetching user access</Body>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor={colors.primary10}
          onPress={() => setPaywallsOpen(true)}
        >
          <Body style={getStyle("paywalls")}>
            3. (Optional) Fetching paywalls
          </Body>
        </TouchableHighlight>
      </View>

      <View
        borderBottomColor="#888"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
      />

      <Modal
        visible={credentialsOpen}
        onRequestClose={() => setCredentialsOpen(false)}
      >
        <ScreenInvalidCredentials />
      </Modal>
      <Modal
        visible={activationOpen}
        onRequestClose={() => setActivationOpen(false)}
      >
        <ScreenInvalidActivation />
      </Modal>

      <Modal visible={accessOpen} onRequestClose={() => setAccessOpen(false)}>
        <ScreenInvalidUserFetch />
      </Modal>

      <Modal
        visible={paywallsOpen}
        onRequestClose={() => setPaywallsOpen(false)}
      >
        <ScreenInvalidPaywallsFetch />
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  container: { padding: 24 },
  textOk: { color: colors.green40 },
  textError: { color: colors.red40 },
  textWaiting: { color: colors.black60 },
});
