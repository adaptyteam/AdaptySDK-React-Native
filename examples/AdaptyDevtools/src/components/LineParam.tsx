import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Line } from './Line';

interface LineParamProps {
  label: string;
  value: React.ReactNode;
  bordered?: boolean;
  topRadius?: boolean;
  bottomRadius?: boolean;
  rightHeavy?: boolean;
  onPress?: () => void;
}

export const LineParam: React.FC<LineParamProps> = ({
  label,
  value,
  bordered = false,
  topRadius = false,
  bottomRadius = false,
  rightHeavy = false,
  onPress,
}) => {
  return (
    <Line
      bordered={bordered}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      onPress={onPress}
    >
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.valueContainer, rightHeavy && styles.rightHeavy]}>
          {typeof value === 'string' ? (
            <Text style={styles.value}>{value}</Text>
          ) : (
            value
          )}
        </View>
      </View>
    </Line>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightHeavy: {
    flex: 2,
  },
  value: {
    fontSize: 16,
    color: '#8E8E93FF',
    textAlign: 'right',
  },
});
