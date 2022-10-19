import React, {useState} from 'react';
import {TouchableHighlight, View, StyleSheet} from 'react-native';

import {ScreenInvalidCredentials} from '../../screens/ScreenInvalidCredentials';
import {colors} from '../Colors';
import {Body, H3} from '../Text';
import {Modal} from './Modal';

/*
 * Progress component displays an information
 * about all stages of the subscription process
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 *
 * Props:
 * credentials, activation
 */
export const Progress = props => {
  const [credentialsOpen, setCredentialsOpen] = useState(false);

  const getStyle = stage => {
    switch (props[stage]) {
      case true:
        return styles.textOk;
      case false:
        return styles.textError;
      default:
        return null;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <H3>This is how apps with Adapty work:</H3>

        <TouchableHighlight
          onPress={() => {
            setCredentialsOpen(true);
          }}>
          <Body style={getStyle('credentials')}>
            0. Reading your credentials (example-only)
          </Body>
        </TouchableHighlight>

        <Body style={getStyle('activation')}>
          1. Activating Adapty instance
        </Body>
      </View>

      <View
        borderBottomColor="#888"
        style={{borderBottomWidth: StyleSheet.hairlineWidth}}
      />

      <Modal
        visible={credentialsOpen}
        onRequestClose={() => setCredentialsOpen(false)}>
        <ScreenInvalidCredentials />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {padding: 24},
  textOk: {color: colors.green40},
  textError: {color: colors.red40},
});
