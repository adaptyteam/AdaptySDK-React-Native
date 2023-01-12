import React from 'react';
import {
  ActivityIndicator,
  PlatformColor,
  View,
  Text,
  TextInput,
  Pressable,
} from 'react-native';

import {Line} from '../Line';

export const LineParam = ({
  label = '',
  value = '',
  onPress,
  bordered = false,
}) => {
  return (
    <Line bordered={bordered} onPress={onPress}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 15,
            flexShrink: 0,
            paddingRight: 8,
            color: onPress
              ? PlatformColor('systemBlue')
              : PlatformColor('label'),
          }}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: PlatformColor('systemGray'),
            flexShrink: 1,
            textAlign: 'right',
          }}>
          {value}
        </Text>
      </View>
    </Line>
  );
};
