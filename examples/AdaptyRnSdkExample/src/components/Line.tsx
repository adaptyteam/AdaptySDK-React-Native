import React from 'react';
import { ActivityIndicator, View, Pressable } from 'react-native';

interface LineProps {
  children: React.ReactNode;
  loading?: boolean;
  bordered?: boolean;
  topRadius?: boolean;
  bottomRadius?: boolean;
  dark?: boolean;
  onPress?: () => void;
}

export const Line: React.FC<LineProps> = ({
  children,
  loading = false,
  bordered = false,
  topRadius = false,
  bottomRadius = false,
  dark = false,
  onPress,
}) => {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#AEAEB2FF' : 'transparent',
          paddingHorizontal: 16,
          paddingVertical: 12,
          ...(topRadius && {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }),
          ...(bottomRadius && {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }),
          ...(bordered && {
            borderBottomColor: dark ? '#2F363F' : '#F2F2F7FF',
            borderBottomWidth: 1,
          }),
        },
      ]}
    >
      {children}
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            right: 16,
            marginVertical: 10,
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </Pressable>
  );
};
