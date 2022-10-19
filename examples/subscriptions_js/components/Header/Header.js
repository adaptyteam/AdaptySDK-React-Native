import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';

import {colors} from '../Colors';
import {H1} from '../Text';

/*
 * Header component displays a welcome view with a logo
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const Header = () => {
  const version =
    global.HermesInternal?.getRuntimeProperties?.()['OSS Release Version'] ??
    '';

  return (
    <ImageBackground
      accessibilityRole="image"
      testID="new-app-screen-header"
      source={require('./logo_adapty.png')}
      style={styles.container}
      imageStyle={styles.logo}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Engine: Hermes {version}</Text>
      </View>
      <H1 style={styles.containerText}>Adapty RN {'\n'}Basic Example</H1>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary10,
    paddingBottom: 48,
    paddingTop: 96,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    opacity: 0.5,
    overflow: 'visible',
    resizeMode: 'cover',
    marginLeft: -128,
    marginBottom: -192,
  },
  containerText: {textAlign: 'center'},
  badge: {
    position: 'absolute',
    padding: 8,
    opacity: 0.6,
  },
  badgeText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});
