import React, {useState} from 'react';
import {PlatformColor, Text} from 'react-native';

import {Line} from '../Line';

export const LineButton = ({
  text = '',
  onPress,
  disabled = false,
  loading = false,
  red = false,
  topRadius = false,
  bottomRadius = false,
  bordered = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = async () => {
    setIsProcessing(true);
    await onPress();
    setIsProcessing(false);
  };

  return (
    <Line
      onPress={disabled && onPress ? undefined : handlePress}
      bordered={bordered}
      topRadius={topRadius}
      bottomRadius={bottomRadius}
      loading={isProcessing || loading}>
      <Text
        style={{
          color: disabled
            ? PlatformColor('systemGray')
            : PlatformColor(red ? 'systemRed' : 'systemBlue'),
          fontSize: 15,
        }}>
        {text}
      </Text>
    </Line>
  );
};
