import React from 'react';
import {View, Text} from 'react-native';

import {Line} from '../Line';

export const LineParam = ({
  label = '',
  value = '',
  rightHeavy = false,
  onPress,
  bordered = false,
}) => {
  return (
    <Line bordered={bordered} onPress={onPress}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontSize: 15,
            flexShrink: rightHeavy ? 1 : 0,
            paddingRight: 8,
            // color: onPress
            //   ? PlatformColor('systemBlue')
            //   : PlatformColor('label'),
            color: onPress ? '#007AFF' : '#000000',
          }}>
          {label}
        </Text>
        {typeof value !== 'object' ? (
          <Text
            style={{
              fontSize: 15,
              // color: PlatformColor('systemGray'),
              color: '#8E8E93FF',
              flexShrink: rightHeavy ? 0 : 1,
              textAlign: 'right',
            }}>
            {value}
          </Text>
        ) : (
          value
        )}
      </View>
    </Line>
  );
};
