import React from 'react';
import {ActivityIndicator, PlatformColor, View, Pressable} from 'react-native';

export const Line = ({
  children,
  loading = false,
  bordered = false,
  topRadius = false,
  bottomRadius = false,
  onPress,
}) => {
  return (
    <Pressable
      activeOpacity={0.5}
      disabled={!onPress}
      onPress={onPress}
      style={({pressed}) => ({
        // backgroundColor: pressed ? PlatformColor('systemGray2') : 'transparent',
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
          // borderBottomColor: PlatformColor('systemGray6'),
          borderBottomColor: '#F2F2F7FF',
          borderBottomWidth: 1,
        }),
      })}>
      {children}
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            right: 16,
            marginVertical: 10,
          }}>
          <ActivityIndicator />
        </View>
      )}
    </Pressable>
  );
};
