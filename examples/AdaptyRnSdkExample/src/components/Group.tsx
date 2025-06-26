import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface GroupProps {
  title?: string;
  postfix?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Group: React.FC<GroupProps> = ({
  title,
  postfix,
  children,
  style,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.titleText}>{title.toUpperCase()}</Text>}
      <View style={[styles.wrapper, style]}>{children}</View>
      {postfix && <Text style={styles.postfixText}>{postfix}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 24, marginBottom: 32 },
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  titleText: {
    marginHorizontal: 16,
    paddingBottom: 8,
    color: '#8E8E93FF',
    fontWeight: '500',
    fontSize: 15,
  },
  postfixText: {
    marginHorizontal: 16,
    paddingTop: 4,
    color: '#8E8E93FF',
    fontSize: 13,
  },
});
