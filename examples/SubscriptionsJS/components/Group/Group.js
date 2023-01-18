import React from 'react';
import {PlatformColor, StyleSheet, Text, View} from 'react-native';

export const Group = ({title, postfix, children}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.titleText}>{title.toUpperCase()}</Text>}
      <View style={styles.wrapper}>{children}</View>
      {postfix && <Text style={styles.postfixText}>{postfix}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginHorizontal: 24, marginBottom: 32},
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  titleText: {
    marginHorizontal: 16,
    paddingBottom: 8,
    // color: PlatformColor('systemGray'),
    color: '#8E8E93FF',
    fontWeight: '500',
    fontSize: 15,
  },
  postfixText: {
    marginHorizontal: 16,
    paddingTop: 4,
    // color: PlatformColor('systemGray'),
    color: '#8E8E93FF',
    fontSize: 13,
  },
});
