import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Line } from './Line';

interface LineButtonProps {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  bordered?: boolean;
  topRadius?: boolean;
  bottomRadius?: boolean;
  onPress?: () => void;
}

export const LineButton: React.FC<LineButtonProps> = ({
  text,
  disabled = false,
  loading = false,
  bordered = false,
  topRadius = false,
  bottomRadius = false,
  onPress,
}) => {
  return (
    <Line
      loading={loading}
      bordered={bordered}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
    </Line>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#4777FF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledText: {
    color: '#8E8E93FF',
  },
});
